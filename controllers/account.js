// Fonction qui appel le middleware qui fait l'appel des informations de profil à la BDD
exports.getUserInfos = (req, res) => {
  console.log(res.locals.user);
  res.status(200).json({
    user: res.locals.user,
  });
};
