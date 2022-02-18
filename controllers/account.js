const argon2 = require('argon2'); // Argon2 module (For password hashing)
const dbConnectMiddleware = require('../middlewares/dbConnect');

// Fonction qui appel le middleware qui fait l'appel des informations de profil à la BDD
exports.getUserInfos = (req, res) => {
  res.status(200).json({
    user : res.locals.user,
  });
};

// Fonction pour modifier le mot de passe
exports.updatePassword = async (req, res) => {
  const {
    newPassword,
    confirmPassword,
  } = req.body;

  // On vérifie que les champs sont remplis
  if (
      !newPassword
      || !confirmPassword
  ) {
    return res.status(400).json({
      error: 'Tous les champs doivent être remplis',
    });
  }
  try {

    if (await argon2.verify(res.locals.PasswordHash, req.body.oldPassword) ===
        false) {
      return res.status(400).json({
        error: 'L\'ancien mot de passe est incorrect',
      });
    }
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      error: 'Mince... Une erreur est survenue',
    });
  }


  console.log("coucou")
  // On vérifie que les mots de passe sont identiques
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      error: 'Les mots de passe ne sont pas identiques',
    });
  }

  // On vérifie que le mot de passe est assez long
  if (newPassword.length < 12) {
    return res.status(400).json({
      error: 'Le mot de passe doit contenir au moins 12 caractères',
    });
  }

  //Générer le hash du nouveau mot de passe
argon2.hash(newPassword).then((hash) => {
res.locals.newPasswordHash = hash;
console.log(res.locals.newPasswordHash);
    dbConnectMiddleware.updatePasswordHashInDB(req, res,() => {
      res.status(200).json({
        message: 'Mot de passe modifié avec succès',
      });
    });
  });
  };

//Fonction de suppression de compte
exports.deleteAccount = async (req, res) => {
  //Supprimer le compte
  dbConnectMiddleware.deleteAccountInDB(req, res, () => {
    res.status(200).json({
      message: 'Compte supprimé avec succès',
    });
  });
};
