const Note = require('../models/note');

exports.getHome = (req, res, next) => {
    res.render('index/home');
}

exports.getDashboard = async (req, res, next) => {
    try {
        const notes = await Note.find({ creator: req.user._id })
        console.log(notes);
        res.render('index/dashboard', {
            notes: notes
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}