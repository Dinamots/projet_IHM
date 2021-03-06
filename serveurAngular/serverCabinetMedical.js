"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**_________________________________________________________________________________________________________________________________
 * Get external libraries ---------------------------------------------------------------------------------------------------------
 **/
const fs = require("fs-extra");
const express = require("express");
const bodyParser = require("body-parser");
const xmldom_1 = require("xmldom");
const multer = require("multer");
const staticGzip = require("http-static-gzip-regexp");
const utils_1 = require("./utils");
// import * as libXML from "libxmljs";
// import * as soap from "soap";
let xmlSerializer = new xmldom_1.XMLSerializer();
let domParser = new xmldom_1.DOMParser();
/**_________________________________________________________________________________________________________________________________
 * Save the XML into a file, file acces is asynchronous ----------------------------------------------------------------------------
 *   - doc : the document containing the XML ---------------------------------------------------------------------------------------
 *   - res : the result stream of a client HTTP request ----------------------------------------------------------------------------
 **/
function saveXML(doc, res) {
    fs.writeFile("./data/cabinetInfirmier.xml", xmlSerializer.serializeToString(doc), function (err) {
        res.setHeader("Content-Type", "text/plain");
        if (err) {
            console.error("Error writing ./data/cabinetInfirmier.xml:\n", err);
            res.writeHead(500);
            res.write(`Error writing ./data/cabinetInfirmier.xml:\n${err}`);
        }
        else {
            res.writeHead(200);
        }
        res.end();
    });
}
/**_________________________________________________________________________________________________________________________________
 * Define HTTP server, implement some ressources -----------------------------------------------------------------------------------
 *   - port : the TCP port on which the HTTP server will be listening --------------------------------------------------------------
 **/
function init(port, applicationServerIP, applicationServerPort) {
    let doc;
    let logs;
    // will reference the document representing the XML structure
    const applicationServer = {
        ip: applicationServerIP,
        port: applicationServerPort
    };
    utils_1.getLoginObject().then(l => {
        logs = l;
    });
    // Read and parse the XML file containing the data
    fs.readFile(__dirname + "/data/cabinetInfirmier.xml").then((dataBuffer) => {
        try {
            const data = dataBuffer.toString();
            doc = domParser.parseFromString(data, "text/xml");
            console.log("/data/cabinetInfirmier.xml successfully parsed !");
        }
        catch (err) {
            console.error("Problem parsing /data/cabinetInfirmier.xml", err);
        }
    }, (err) => {
        console.error("Problem reading file /data/cabinetInfirmier.xml", err);
    });
    // Initialize the HTTP server
    const app = express();
    app.use(staticGzip(/^\/?dist\/.*(\.js|\.css)$/))
        .use(express.static(__dirname)) // Associate ressources for accessing local files
        .use(bodyParser.urlencoded({ extended: false })) // Add a parser for urlencoded HTTP requests
        .use(bodyParser.json()) // Add a parser for json HTTP request
        .use(multer({ dest: "./uploads/" }).array()) // Add a parser for file transmission
        .listen(port); // HTTP server listen to this TCP port
    app.disable("etag");
    // Define HTTP ressource GET /
    app.get("/", (req, res) => {
        // console.log('Getting /');
        fs.readFile(__dirname + "/start.html").then((data) => {
            // Parse it so that we can add secretary and all nurses
            const docHTML = domParser.parseFromString(data.toString());
            const datalist = docHTML.getElementById("logins");
            const L_nurses = Array.from(doc.getElementsByTagName("infirmier"));
            L_nurses.forEach(nurse => {
                const option = docHTML.createElement("option");
                option.setAttribute("value", nurse.getAttribute("id"));
                option.textContent = nurse.getElementsByTagName("prénom")[0].textContent
                    + " "
                    + nurse.getElementsByTagName("nom")[0].textContent;
                datalist.appendChild(option);
            });
            res.writeHead(200);
            res.write(xmlSerializer.serializeToString(docHTML));
            res.end();
        }, (err) => {
            res.writeHead(500);
            return res.end("Error loading start.html : " + err);
        });
    });
    // Define HTTP ressource POST /, contains a login that identify the secretary or one nurse
    app.post("/", (req, res) => {
        switch (req.body.login) {
            case "Secretaire":
                fs.readFile(__dirname + "/secretary.html").then(dataBuffer => {
                    res.writeHead(200);
                    res.write(dataBuffer.toString());
                    res.end();
                }, (err) => {
                    res.writeHead(500);
                    return res.end("Error loading secretary.html : ", err);
                });
                break;
            default:// Is it a nurse ?
                res.writeHead(200);
                res.write("Unsupported login : " + req.body.login);
                res.end();
        }
    });
    app.post("/removePatient", (req, res) => {
        console.log("/removePatient, \nreq.body:\n\t", req.body, "\n_______________________");
        const patient = utils_1.createPatient(req.body);
        // Is it a new patient or not ?
        let patientElem = utils_1.getPatient(doc, patient.numéroSécuriteSociale);
        if (patientElem) {
            utils_1.removePatientFromDoc(patientElem);
            saveXML(doc, res);
        }
    });
    // Define HTTP ressource PORT /addPatient, may contains new patient information
    app.post("/addPatient", (req, res) => {
        console.log("/addPatient, \nreq.body:\n\t", req.body, "\n_______________________");
        const patient = utils_1.createPatient(req.body);
        const patients = doc.getElementsByTagName("patients")[0];
        if (utils_1.numeroAlreadyExist(req.body.patientNumber, doc)) {
            utils_1.sendError("Error patientNumber already exist:", 500, res);
            return;
        }
        patients.appendChild(utils_1.createPatientElem(patient, doc));
        saveXML(doc, res);
    });
    app.post("/updatePatient", (req, res) => {
        console.log("/updatePatient, \nreq.body:\n\t", req.body, "\n_______________________");
        if (utils_1.numeroAlreadyExist(req.body.patientNumber, doc)
            && req.body.patientNumber !== req.body.object.numeroSecuriteSociale) {
            utils_1.sendError("Error patientNumber already exist:", 500, res);
            return;
        }
        const patient = utils_1.createPatient(req.body);
        let oldPatient = utils_1.getPatient(doc, req.body.object.numeroSecuriteSociale);
        let intervenantId = utils_1.getIntervenantOfPatient(oldPatient);
        const patients = doc.getElementsByTagName("patients")[0];
        utils_1.removePatientFromDoc(oldPatient);
        patients.appendChild(utils_1.createPatientElem(patient, doc, intervenantId));
        saveXML(doc, res);
    });
    // Define HTTP ressource POST /affectation, associate a patient with a nurse
    app.post("/affectation", (req, res) => {
        if (typeof req.body.infirmier === "undefined"
            || typeof req.body.patient === "undefined") {
            res.writeHead(500);
            res.end("You should specify 'infirmier' with her id and 'patient' with her social security number in your request.");
        }
        else {
            const nurse = doc.getElementById(req.body.infirmier);
            if (nurse || req.body.infirmier === "none") {
                // Get node corresponding to the patient
                const LP = Array.from(doc.getElementsByTagName("patient"));
                LP.forEach(patient => {
                    const node_num = patient.getElementsByTagName("numéro")[0];
                    if (node_num.textContent === req.body.patient) {
                        if (req.body.infirmier === "none") {
                            req.body.infirmier = "";
                        }
                        patient.getElementsByTagName("visite")[0].setAttribute("intervenant", req.body.infirmier);
                        saveXML(doc, res);
                    }
                });
            }
            else {
                res.writeHead(500);
                res.end("There is no nurse identified by id", req.body.infirmier);
            }
        }
    });
    app.post("/loginRequest", (req, res) => {
        let infos = utils_1.getInfo(req.body.username, req.body.password, logs);
        console.log(infos);
        if (!infos) {
            utils_1.sendError("Error wrong username or password", 403, res);
        }
        else {
            utils_1.sendValue(infos, 200, res);
        }
    });
    // Define HTTP ressource POST /INFIRMIERE
    app.post("/INFIRMIERE", (req, res) => {
        res.end("INFIRMIERE "
            + req.body.id
            + ". WARNING: You should configure the optimization application server IP and port. "
            + "//By default, the optimization application server is configured to be the HCI one.");
    });
    /*
    app.get ( "/check", (req, res) => {
            const P_xml: Promise<string> = fs.readFile( __dirname + "/data/cabinetInfirmier.xml" ).then(
                dataBuffer => dataBuffer.toString()
            );
            const P_xsd: Promise<string> = fs.readFile( __dirname + "/data/cabinet.xsd" ).then(
            dataBuffer => dataBuffer.toString()
            );
            const P_all = Promise.all( [P_xml, P_xsd] );

            P_all.then	( ([str_xml, str_xsd]) => { // If resolved
                    // Check xml / xsd
                    console.log( "./data/cabinet.xsd" );
                    const xsdDoc = libXML.parseXml(str_xsd); console.log(1);
                    const xmlDoc = libXML.parseXml(str_xml); console.log(2);
                    xmlDoc.validate(xsdDoc); console.log(3);
                    console.log(xmlDoc.validationErrors);
                    res.end( JSON.stringify(xmlDoc.validationErrors) );
                }
                , () => { // If rejected
                    res.end("Error, promises rejected");
                }
            );
        }
    );*/
}
/**_________________________________________________________________________________________________________________________________
 * Parse command line parameters and initialize everything ------------------------------------------------------------------------
 **/
let params = {}, p;
for (let i = 2; i < process.argv.length; i++) {
    p = process.argv[i].split(":");
    params[p[0]] = p[1];
}
const port = params["port"] || "8090", applicationServerIP = params["applicationServerIP"] || "127.0.0.1", applicationServerPort = params["applicationServerPort"] || "8080";
console.log(`Usage :
    node staticServeur.js [port:PORT]
    Default port is 8090.
    Current port is ${port}
`);
console.log("HTTP server listening on port ", port);
init(port, applicationServerIP, applicationServerPort);
//# sourceMappingURL=serverCabinetMedical.js.map