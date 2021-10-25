import {checkMail, checkPassword} from "../functions";

document.getElementById("btnSignUp").onclick = function (e) {
    e.preventDefault();
    let formData = new FormData(document.querySelector("form"));

    if ((checkMail(formData.get("mail")) === true ) && (checkPassword(formData.get("password")) === true)) {
        let user = Object.create({});
        user.mail = formData.get("mail");
        user.password = formData.get("password");

        let request = { user };
        console.log(request);
        //Faire une requête POST à l'API qui envoie request
        fetch(apiUrl + "/signUp", { //TODO : Définir la bonne URL
            method: "POST",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((orderApi) => {
                window.location.href =   "signup.html";
            });
    }
    else {
        alert("Merci de vérifier les données saisies");
    }
};
