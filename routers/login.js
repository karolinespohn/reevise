const db = require("./db")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const saltRounds = 10;

require("dotenv").config();
exports.login = async function (req, res) {
    // user submitted data
    if (req.body && req.body.emailOrUsername && req.body.password) {

        let user = await db.query('SELECT * FROM users WHERE username ILIKE $1 or email ILIKE $1', req.body.emailOrUsername)

        let errors = []

        // there is no user with this email/username
        if (user.length === 0) {
            //regex used to check if user tried to type in email or username
            const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;

            if (validEmailRegex.test(req.body.emailOrUsername)) {
                errors.push("there is no account registered to this email address")
            } else {
                errors.push("there is no account registered to this username")
            }
            res.render("login", {errors: errors})
            // there is a user with this username/email
        } else {
            // check password if username was entered
            if (user[0].password === req.body.password) {
                const uid = user[0].uid
                let token = jwt.sign({
                    uid: uid,
                }, process.env.jvtSecretKey)
                res.cookie("jwt", token, {httpOnly: true, sameSite: "strict",})
                res.redirect('/home')
            } else {
                res.render("login", {errors: ["incorrect password"]})
            }
        }
        // user hasn't submitted data yet
    } else {
        res.render("login", {});
    }
}
