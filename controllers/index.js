exports.getHomePage = (req, res) => {
  res.status(200).render("welcome");
};

exports.getDashboard = (req, res) => {
  res.status(200).render("dashboard", { name: req.user.name });
};
