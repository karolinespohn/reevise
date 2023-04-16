const jwt = require("jsonwebtoken");
const db = require("./db")
const {json} = require("express");
exports.stack = async function (req, res) {

    if (req.body.difficulty) {

        const levelChanges = [-2, 0, 1, 2]
        await adjustFlashcard(req.body.difficulty, req.body.answeredFlashcard)
    }

    let errors = []
    let flashcard

    try {
        let result = await db.query('SELECT * FROM flashcards WHERE parent  = $1 order by "nextLearningDate" limit 1',
            [req.query.id])

        flashcard = result[0];
    } catch (e) {
        console.log(e)
        errors.push("internal error")
    }
    let flashcardID
    let stackNotEmpty
    let flashcardParent = req.query.id
    if (typeof flashcard !== "undefined") {
        stackNotEmpty = true
        flashcard.front = JSON.stringify(flashcard.front)
        flashcard.back = JSON.stringify(flashcard.back)
        flashcardID = flashcard.flashcardID
    } else {
        stackNotEmpty = false
        flashcard = {
            front: {},
            back: {},
        }
    }
    let parentFolder = await db.query('SELECT parent FROM stacks WHERE "stackID" = $1', [req.query.id])
    parentFolder = parentFolder[0].parent
    // checks if parent is root
    let directlyUnderRoot = parentFolder === null

    res.render("stack", {parentFolder, flashcard, flashcardID, flashcardParent, errors, directlyUnderRoot, stackNotEmpty})
}

async function adjustFlashcard(difficulty, answeredFlashcard) {
    // change lastLearningDate
    answeredFlashcard = JSON.parse(answeredFlashcard)
    const lastLearningDate = new Date(Date.now()).toISOString()

    let timesAnsweredIncorrectly = answeredFlashcard.timesAnsweredIncorrectly, timesAnsweredHard = answeredFlashcard.timesAnsweredHard
    let timesAnsweredMedium = answeredFlashcard.timesAnsweredMedium, timesAnsweredEasy = answeredFlashcard.timesAnsweredEasy
    let newLevel = 0
    let index = []
    if (difficulty === "Incorrect") {
        newLevel = Math.max(0, (answeredFlashcard.level - 2))
        timesAnsweredIncorrectly++
        index = 0
    } else if (difficulty === "Hard") {
        newLevel = answeredFlashcard.level
        if (answeredFlashcard.level >= 4) newLevel = answeredFlashcard.level - 1
        timesAnsweredHard++
        index = 1
    } else if (difficulty === "Medium") {
        newLevel = Math.min(7, (answeredFlashcard.level + 1))
        timesAnsweredMedium++
        index = 2
    } else {
        newLevel = Math.min(7, (answeredFlashcard.level + 2))
        timesAnsweredEasy++
        index = 3
    }

    const now = new Date();
    const twoMinutesFromNow = new Date(now.getTime() + 120000); // 2 minutes
    const fiveMinutesFromNow = new Date(now.getTime() + 300000); // 5 minutes
    const tenMinutesFromNow = new Date(now.getTime() + 600000); // 10 minutes
    const twentyMinutesFromNow = new Date(now.getTime() + 1200000); // 20 minutes
    const thirtyMinutesFromNow = new Date(now.getTime() + 1800000); // 30 minutes
    const oneHourFromNow = new Date(now.getTime() + 3600000); // 1 hour
    const twoHoursFromNow = new Date(now.getTime() + 7200000); // 2 hours
    const oneDayFromNow = new Date(now.getTime() + 86400000); // 1 day
    const twoDaysFromNow = new Date(now.getTime() + 172800000); // 2 days
    const threeDaysFromNow = new Date(now.getTime() + 259200000); // 3 days
    const fiveDaysFromNow = new Date(now.getTime() + 432000000); // 5 days
    const oneWeekFromNow = new Date(now.getTime() + 604800000); // 1 week
    const twoWeeksFromNow = new Date(now.getTime() + 1209600000); // 2 weeks
    const oneMonthFromNow = new Date(now.getTime() + 2592000000); // 1 month (approximation)
    const threeMonthsFromNow = new Date(now.getTime() + 7776000000); // 3 months (approximation)
    const sixMonthsFromNow = new Date(now.getTime() + 15552000000); // 6 months (approximation)


    const nextLearningDateArray = [
        [twoMinutesFromNow, tenMinutesFromNow, oneHourFromNow, oneDayFromNow], //level 0
        [fiveMinutesFromNow, twentyMinutesFromNow, oneDayFromNow, threeDaysFromNow], //level 1
        [fiveMinutesFromNow, thirtyMinutesFromNow, twoDaysFromNow, fiveDaysFromNow], //level 2
        [fiveMinutesFromNow, oneHourFromNow, threeDaysFromNow, oneWeekFromNow], //level 3
        [fiveMinutesFromNow, twoHoursFromNow, fiveDaysFromNow, twoWeeksFromNow], //level 4
        [fiveMinutesFromNow, twoHoursFromNow, oneWeekFromNow, oneMonthFromNow], //level 5
        [fiveMinutesFromNow, oneDayFromNow, twoWeeksFromNow, threeMonthsFromNow], //level 6
        [fiveMinutesFromNow, oneDayFromNow, oneMonthFromNow, sixMonthsFromNow] //level 7
    ]
    console.log(answeredFlashcard.level)
    console.log(index)

    const nextLearningDate = nextLearningDateArray[answeredFlashcard.level][index]

    await db.none('update flashcards SET "lastLearningDate" = $1, "nextLearningDate" = $2, "timesAnsweredIncorrectly" = $3, "timesAnsweredHard" = $4, "timesAnsweredMedium" = $5, "timesAnsweredEasy" = $6, "level" = $7 where "flashcardID" = $8',
        [lastLearningDate, nextLearningDate, timesAnsweredIncorrectly, timesAnsweredHard, timesAnsweredMedium, timesAnsweredEasy, newLevel, answeredFlashcard.flashcardID])

}