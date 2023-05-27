const db = require('./db')
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.register = async function (req, res) {
    let errors = [];
    // user submitted something
    if (req.body && req.body.email && req.body.username && req.body.password) {

        const validUsernameRegex = /^[a-zA-ZäöüÄÖÜ_.0-9]{4,20}$/;
        const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;

        // mail
        if (!validEmailRegex.test(req.body.email)) errors.push("please enter a valid email address")
        // username
        if (!validUsernameRegex.test(req.body.username)) errors.push("please enter a valid username")
        // password
        if (req.body.password.length < 8 || req.body.password.length > 32) errors.push("please enter a valid password between 8 and 32 characters")

        if (errors.length !== 0) {
            res.render("register", {errors: errors})
            return;
        }

        let duplicates = [];

        try {

            let user = await db.query('SELECT * FROM users WHERE username ILIKE $1 or email ILIKE $2', [req.body.username, req.body.email])
            if (user.length !== 0) throw new SQLException()
            let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
            await db.none('insert into users(email, username, password) values($1, $2, $3)',
                [req.body.email, req.body.username, hashedPassword])
        } catch (e) {

            // unique constraint on username & email -> if exception i check if duplicate username/email was entered

            let duplicateUsers = await db.query('SELECT * FROM users WHERE username ILIKE $1', req.body.username);
            if (duplicateUsers.length !== 0) {
                duplicates.push("this username is already taken")
            }

            // checks if email is already taken
            let duplicateEmail = await db.query('SELECT * FROM users WHERE email ILIKE $1', req.body.email);
            if (duplicateEmail.length !== 0) {
                duplicates.push("there is already an account registered to this email address")
            }
            res.render("register", {duplicates: duplicates})
           // console.log(duplicates)
            return;
        }

        res.redirect("/home")


    } else {
        res.render("register", {});
    }
}