const jwt = require("jsonwebtoken");
const db = require("./db")
const { v4 } = require("uuid");
const {listen} = require("express/lib/application");

exports.edit = async function (req, res) {
    if (req.query.parentID) { //new flashcard
        const uuid = v4()
        console.log("uuid", uuid)
        await db.none('insert into flashcards("flashcardID", "parent") values ($1, $2)', [uuid, req.query.parentID])
        res.redirect("/edit?id=" + uuid)
        return
    }
    if(req.body && req.body.frontDataInput) { //Post request
        const front = req.body.frontDataInput
        const back = req.body.backDataInput
        await db.none('update flashcards SET front = $1, back = $2 where "flashcardID" = $3', [front, back, req.query.id])
        let stackID = await db.query('SELECT parent FROM flashcards WHERE "flashcardID" = $1', [req.query.id])
        stackID = stackID[0].parent
        console.log(stackID)
        res.redirect("/stack?id=" + stackID)
        return
    }
    let errors = []
    let flashcard
    if (req.query.id) { // edit flashcard
        let result = await db.query('SELECT * FROM flashcards WHERE "flashcardID" = $1', [req.query.id])

        flashcard = result[0];
        flashcard.front = JSON.stringify(flashcard.front)
        flashcard.back = JSON.stringify(flashcard.back)
    } else { // new flashcard
        flashcard = {
            front: "",
            back: "",
        }

    }
    res.render("edit", {flashcard, errors})

}