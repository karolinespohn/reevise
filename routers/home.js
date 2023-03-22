const jwt = require("jsonwebtoken");
const db = require('./db')
exports.home = async function (req, res) {
    let errors = []
    let current;
    let parent = null;
    //jetztiger ordner = req.body.id

    // checks if there is a folderid
    if (req.query.id) {
        try {
            console.log(req.query.id)
            let result = await db.query('SELECT parent FROM folders WHERE "folderID" = $1 and owner = $2', [req.query.id, req.uid])
            if (result.length !== 0) parent = result[0].parent
        } catch (e) {
            console.log(e)
            errors.push('internal error')
        }
    }

    let directlyUnderRoot = req.query.id && !parent

    // checks parent id
    if (req.query && req.query.id) {
        current = req.query.id;
    } else {
        current = null;
    }

    console.log(req.body)
    // user creates folder
    if (req.body && req.body.folderName) {
        if (req.body.folderName.length < 1 || req.body.folderName.length > 64) {
            errors.push('please enter a folder name between 1 and 64 characters')
        } else {
            try {
                await db.none('insert into folders("folderName", owner, parent) values($1, $2, $3)',
                    [req.body.folderName, req.uid, current])
            } catch (e) {
                errors.push('internal error')
            }
        }
    }

    //user creates stack
    if (req.body && req.body.stackName) {
        if (req.body.stackName.length < 1 || req.body.stackName.length > 64) {
            errors.push('please enter a stack name between 1 and 64 characters')
        } else {
            try {
                await db.none('insert into stacks("stackName", owner, parent) values($1, $2, $3)',
                    [req.body.stackName, req.uid, current])
            } catch (e) {
                errors.push('internal error')
            }
        }
    }

    let folders = [];
    let stacks = [];

    // try/catch to get folders and stacks with current as parent
    try {
        if (current) {
        folders = await db.query('SELECT * FROM folders WHERE parent = $1 and owner = $2', [current, req.uid])
        stacks = await db.query('SELECT * FROM stacks WHERE parent = $1 and owner = $2', [current, req.uid])
        } else {
        folders = await db.query('SELECT * FROM folders WHERE parent is null and owner = $1', req.uid)
        stacks = await db.query('SELECT * FROM stacks WHERE parent is null and owner = $1', req.uid)
        }
    } catch (e) {
        console.log(e)
    }
    let folderObjects = []
    for (let f of folders) {
        let folderName = f.folderName
        let folderID = f.folderID
        folderObjects.push({folderName, folderID})
    }
    let stackObjects = []
    for (let s of stacks) {
        let stackName = s.stackName
        let stackID = s.stackID
        stackObjects.push({stackName, stackID})
    }

    res.render('home', {folderObjects, stackObjects, errors, parent, directlyUnderRoot})
}

