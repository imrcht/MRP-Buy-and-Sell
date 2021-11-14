exports.getCompany = (req, res, next) => {
  res.render("details/company");
};

exports.getTeam = (req, res, next) => {
  res.render("details/team");
};

exports.getContact = (req, res, next) => {
  res.render("details/contact");
};
