"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
function createElem(name, value, doc) {
    const newElem = doc.createElement(name);
    newElem.appendChild(doc.createTextNode(value));
    return newElem;
}
exports.createElem = createElem;
function getIntervenantOfPatient(patient) {
    let visiteElem = patient.getElementsByTagName("visite")[0];
    return visiteElem.hasAttribute("intervenant") ? visiteElem.getAttribute("intervenant") : null;
}
exports.getIntervenantOfPatient = getIntervenantOfPatient;
function removePatientFromDoc(patient) {
    while (patient.childNodes.length) {
        patient.removeChild(patient.childNodes[0]);
    }
    let parent = patient.parentNode;
    parent.removeChild(patient);
}
exports.removePatientFromDoc = removePatientFromDoc;
function createPatient(data) {
    return {
        prénom: data.patientForname || "",
        nom: data.patientName || "",
        sexe: data.patientSex || "F",
        naissance: data.patientBirthday || "",
        numéroSécuriteSociale: data.patientNumber || "undefined",
        adresse: {
            ville: data.patientCity || "",
            codePostal: data.patientPostalCode || "",
            rue: data.patientStreet || "",
            numéro: data.patientStreetNumber || "",
            étage: data.patientFloor || ""
        }
    };
}
exports.createPatient = createPatient;
function createPatientElem(patient, doc, intervenantId) {
    let newPatient = doc.createElement("patient");
    // Name
    newPatient.appendChild(createElem("nom", patient.nom, doc));
    // Forname
    newPatient.appendChild(createElem("prénom", patient.prénom, doc));
    // Social security number
    newPatient.appendChild(createElem("numéro", patient.numéroSécuriteSociale, doc));
    // Sex
    newPatient.appendChild(createElem("sexe", patient.sexe, doc));
    // Birthday
    newPatient.appendChild(createElem("naissance", patient.naissance, doc));
    // Visites
    const visite = doc.createElement("visite");
    visite.setAttribute("date", "2014-12-08");
    if (intervenantId !== null) {
        visite.setAttribute("intervenant", intervenantId);
    }
    newPatient.appendChild(visite);
    // Adress
    const adresse = doc.createElement("adresse");
    newPatient.appendChild(adresse);
    adresse.appendChild(createElem("étage", patient.adresse.étage, doc));
    adresse.appendChild(createElem("numéro", patient.adresse.numéro, doc));
    adresse.appendChild(createElem("rue", patient.adresse.rue, doc));
    adresse.appendChild(createElem("ville", patient.adresse.ville, doc));
    adresse.appendChild(createElem("codePostal", patient.adresse.codePostal, doc));
    return newPatient;
}
exports.createPatientElem = createPatientElem;
function numeroAlreadyExist(socialSecurityNumber, doc) {
    const patients = Array.from(doc.getElementsByTagName("patient"));
    return patients.reduce((acc, patient) => {
        if (patient.getElementsByTagName("numéro")[0].textContent.trim() === socialSecurityNumber) {
            return acc + 1;
        }
        return acc;
    }, 0) !== 0;
}
exports.numeroAlreadyExist = numeroAlreadyExist;
/**_________________________________________________________________________________________________________________________________
 * Returns DOM node of patient identified by numlber in document doc or null if there is no such patient ---------------------------
 **/
function getPatient(doc, socialSecurityNumber) {
    const L = Array.from(doc.getElementsByTagName("patient")); // doc.getElementsByTagName('patient');
    return L.find(E => E.getElementsByTagName("numéro")[0].textContent === socialSecurityNumber);
}
exports.getPatient = getPatient;
function getLoginObject() {
    return __awaiter(this, void 0, void 0, function* () {
        let dataBuff = yield fs.readFile(__dirname + "/data/login.json");
        return JSON.parse(dataBuff.toString());
    });
}
exports.getLoginObject = getLoginObject;
function sendError(msg, code, res) {
    console.error(msg + "\n");
    res.writeHead(code, msg + "\n");
    res.end();
}
exports.sendError = sendError;
function sendValue(value, code, res) {
    res.send(value);
    res.end();
}
exports.sendValue = sendValue;
function getInfo(username, password, logs) {
    let user = logs[username];
    if (user) {
        return user.password === password ? user.infos : null;
    }
}
exports.getInfo = getInfo;
//# sourceMappingURL=utils.js.map