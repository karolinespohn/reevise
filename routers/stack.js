const jwt = require("jsonwebtoken");
const db = require('./db')
exports.stack = async function (req, res) {
    let errors = []
    let flashcard

    try {
        let result = await db.query('SELECT * FROM flashcards WHERE parent  = $1 and owner = $2 order by "nextLearningDate" limit 1',
            [req.query.id, req.uid])
        console.log(result)
        flashcard = result[0];
        console.log('flashcard', flashcard)
    } catch (e) {
        console.log('catch')
        console.log(e)
        errors.push('internal error')
    }
    if (typeof flashcard !== 'undefined') {
        flashcard.front = JSON.stringify(flashcard.front)
        flashcard.back = JSON.stringify(flashcard.back)
    }

    res.render('stack', {flashcard, errors})
}