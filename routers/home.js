const jwt = require("jsonwebtoken");
const db = require("./db")
exports.home = async function (req, res) {
    let errors = []
    let current;
    let parent = null;
    //jetztiger ordner = req.body.id
    // console.log(req.body)
    // checks if there is a folderid
    if (req.query.id) {
        try {
            let result = await db.query('SELECT parent FROM folders WHERE "folderID" = $1 and owner = $2', [req.query.id, req.uid])
            if (result.length !== 0) parent = result[0].parent
        } catch (e) {
            console.log(e)
            errors.push("internal error")
        }
    }

    let directlyUnderRoot = req.query.id && !parent

    // checks parent id
    if (req.query && req.query.id) {
        current = req.query.id;
    } else {
        current = null;
    }

    // user creates folder
    if (req.body && req.body.folderName) {
        if (!req.body.folderName.length < 1 || !req.body.folderName.length > 64) {
            try {
                await db.none('insert into folders("folderName", owner, parent) values($1, $2, $3)',
                    [req.body.folderName, req.uid, current])
                res.redirect(req.url)
                return
            } catch (e) {
                console.log(e)
                errors.push("internal error")
            }
        }
    }

    //user creates stack
    if (req.body && req.body.stackName) {
        if (!req.body.stackName.length < 1 || !req.body.stackName.length > 64) {
            try {
                await db.none('insert into stacks("stackName", owner, parent) values($1, $2, $3)',
                    [req.body.stackName, req.uid, current])
                res.redirect(req.url)
                return
            } catch (e) {
                errors.push("internal error")
                console.log(e)
            }
        }
    }

    // user renames folder
    if (req.body && req.body.changedFolderName) {
        if (!req.body.changedFolderName.length < 1 || !req.body.changedFolderName.length > 64) {
            try {
                await db.none('update folders SET "folderName" = $1 where "folderID"= $2', [req.body.changedFolderName, req.body.changedFolderID])
                res.redirect(req.url)
                return
            } catch (e) {
                errors.push("internal error")

            }
        }
    }
    // user renames stack
    if (req.body && req.body.changedStackName) {
        if (!req.body.changedStackName.length < 1 || !req.body.changedStackName.length > 64) {
            try {
                await db.none('update stacks SET "stackName" = $1 where "stackID"= $2', [req.body.changedStackName, req.body.changedStackID])
                res.redirect(req.url)
                return
            } catch (e) {
                errors.push("internal error")

            }
        }
    }
    // user deletes folder
    if (req.body && req.body.deleteFolder) {
        await db.none('delete from folders where "folderID" = $1', [req.body.deletedFolderID])
    }
    // user deletes stack
    if (req.body && req.body.deleteStack) {
        await db.none('delete from stacks where "stackID" = $1', [req.body.deletedStackID])
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

    stacks.sort()
    let stackObjects = []
    for (let s of stacks) {
        let stackName = s.stackName
        let stackID = s.stackID
        stackObjects.push({stackName, stackID})
    }

    res.render("home", {folderObjects, stackObjects, errors, parent, directlyUnderRoot})
}



