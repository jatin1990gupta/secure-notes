const express = require('express');

const noteController = require('../controllers/noteController');

const router = express.Router();

router.get('/createNote', noteController.getCreateNote);

router.post('/createNote', noteController.postCreateNote);

router.get('/editNote/:noteId', noteController.getEditNote);

router.post('/editNote', noteController.postEditNote);

router.get('/deleteNote/:noteId', noteController.getDeleteNote);

module.exports = router;