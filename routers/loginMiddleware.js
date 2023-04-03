const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.requireAuth = function (req, res, next) {
    /*
    this function is used to save cookie of whether a user is logged in or not
     */
    if (!req.cookies) {
        res.redirect("/login")
        return;
    }
    let cookie = req.cookies["jwt"]
    if (!cookie){
        res.redirect("/login")
        return;
    }
    try {
        let result = jwt.verify(cookie, process.env.jvtSecretKey)
        let iat = result.iat;
        let yesterday = (new Date().getMilliseconds()) - (24 * 3600 * 1000)
        if (iat < yesterday) {
            res.redirect("/login")
            return;
        }
        req.uid = result.uid
        next();
    } catch (e) {
        res.redirect("/login")
        return;
    }


}