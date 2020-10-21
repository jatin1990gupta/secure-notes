const Note = require('../models/note');
const User = require('../models/user');

exports.getCreateNote = (req, res, next) => {
    res.render('note/editNote', {editing: false});
}
exports.postCreateNote = async (req, res, next) => {

    const title = req.body.title;
    const body = req.body.body;


    try {
        const note = new Note({
            title: title,
            body: body,
            creator: req.user._id
        })

        await note.save();
        const user = await User.findById(req.user._id);
        user.notes.push(note);
        await user.save();

        res.redirect('/dashboard');

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEditNote = async (req, res, next) => {

    try {
        const noteId = req.params.noteId;
        const note = await Note.findById(noteId);

        res.render('note/editNote', {
            title: note.title,
            body: note.body,
            noteId: noteId,
            editing: true
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postEditNote = async (req, res, next) => {

    try {
        const noteId = req.body.noteId;
        const title = req.body.title;
        const body = req.body.body;

        const note = await Note.findById(noteId);

        note.title = title;
        note.body = body;

        await note.save();

        res.redirect('/dashboard');

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getDeleteNote = async (req, res, next) => {

    try {
        const noteId = req.params.noteId;

        await Note.findByIdAndRemove(noteId);

        const user = await User.findById(req.user._id);
        user.notes.pull(noteId);
        await user.save();

        res.redirect('/dashboard');
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}