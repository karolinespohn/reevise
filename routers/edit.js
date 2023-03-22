const jwt = require("jsonwebtoken");
const db = require('./db')
exports.edit = async function (req, res) {
    let errors = []
    let flashcard
    if (req.query.id) { // edit flashcard
        let result = await db.query('SELECT * FROM flashcards WHERE parent  = $1 and owner = $2 order by "nextLearningDate" limit 1',
            [req.query.id, req.uid])
        console.log(result)
        flashcard = result[0];
    } else { // new flashcard
        flashcard = {
            front:'',
            back:'',

        }

    }
    res.render('edit', {flashcard, errors})

}