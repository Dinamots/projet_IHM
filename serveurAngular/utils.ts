import * as fs from "fs-extra";

export function createElem(name: string, value: string, doc: Document): Element {
    const newElem = doc.createElement(name);
    newElem.appendChild(doc.createTextNode(value));
    return newElem;
}

export function getIntervenantOfPatient(patient: Element): string {
    let visiteElem: Element = patient.getElementsByTagName("visite")[0];
    return visiteElem.hasAttribute("intervenant") ? visiteElem.getAttribute("intervenant") : null;
}

export function removePatientFromDoc(patient: Element) {
    while (patient.childNodes.length) {
        patient.removeChild(patient.childNodes[0]);
    }
    let parent = patient.parentNode;
    parent.removeChild(<Node>patient);
}

export function createPatient(data) {
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

export function createPatientElem(patient, doc: Document, intervenantId?: string) {
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

export function numeroAlreadyExist(socialSecurityNumber: string, doc: Document): boolean {
    const patients: Element[] = Array.from(doc.getElementsByTagName("patient"));
    return patients.reduce((acc, patient) => {
        if (patient.getElementsByTagName("numéro")[0].textContent.trim() === socialSecurityNumber) {
            return acc + 1;
        }
        return acc;
    }, 0) !== 0;
}

/**_________________________________________________________________________________________________________________________________
 * Returns DOM node of patient identified by numlber in document doc or null if there is no such patient ---------------------------
 **/
export function getPatient(doc: XMLDocument, socialSecurityNumber: string): Element {
    const L: Element[] = Array.from(doc.getElementsByTagName("patient")); // doc.getElementsByTagName('patient');
    return L.find(E => E.getElementsByTagName("numéro")[0].textContent === socialSecurityNumber);
}

export async function getLoginObject() {
    let dataBuff = await fs.readFile(__dirname + "/data/login.json");
    return JSON.parse(dataBuff.toString());
}

export function sendError(msg: string, code: number, res) {
    console.error(msg + "\n");
    res.writeHead(code, msg + "\n");
    res.end();
}

export function sendValue(value: object, code: number, res) {
    res.send(value);
    res.end();
}

export function getInfo(username: string, password: string, logs) {
    let user = logs[username];
    if (user) {
        return user.password === password ? user.infos : null;
    }
}

