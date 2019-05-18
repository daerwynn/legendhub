var express = require("express");
var router = express.Router();

router.get(["/", "/index.html"], function(req, res, next) {
    res.render("quests/index", {title: "Express" });
});

module.exports = router;
