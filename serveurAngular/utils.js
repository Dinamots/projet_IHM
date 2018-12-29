"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function removePatient(patient) {
}
/**_________________________________________________________________________________________________________________________________
 * Returns DOM node of patient identified by numlber in document doc or null if there is no such patient ---------------------------
 **/
function getPatient(doc, socialSecurityNumber) {
    const L = Array.from(doc.getElementsByTagName("patient")); // doc.getElementsByTagName('patient');
    return L.find(E => E.getElementsByTagName("numéro")[0].textContent === socialSecurityNumber);
}
exports.getPatient = getPatient;
//# sourceMappingURL=utils.js.map