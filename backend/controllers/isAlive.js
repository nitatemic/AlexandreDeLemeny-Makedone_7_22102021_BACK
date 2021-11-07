//Fonction qui renvoie le code 200 de réponse si le serveur est en marche
exports.isAlive = function (req, res) {
  res
    .status(200)
    .send(
      "I'm a-stayin' alive, stayin' alive\n" +
        "Ah, ah, ah, ah, stayin' alive, stayin' alive\n" +
        "Ah, ah, ah, ah, stayin' ali-i-i-i-ive"
    );
};
