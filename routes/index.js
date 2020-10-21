const express = require("express");

const isAuth = require("../middleware/is-auth");

const indexController = require("../controllers/indexController");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.redirect("/home");
});

router.get("/home", indexController.getHome);

router.get("/dashboard", isAuth, indexController.getDashboard);

module.exports = router;
