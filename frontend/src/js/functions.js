/* ------------ Fonction qui vérifie l'adresse mail (Return boolean) ------------ */
function checkMail(mail) {
    let regex = /^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$/i;
    return regex.test(mail);
}
/* ------------ Fin fonction qui vérifie l'adresse mail ------------ */

/* ------------ Fonction qui vérifie le mot de passe (Return boolean) ------------ */
function checkPassword(pass) {
    let regex = /^.*(?=.{12,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[`~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/gm;
    return regex.test(pass);
}
/* ------------ Fin fonction qui vérifie le mot de passe ------------ */


export {
    checkMail,
    checkPassword
}
