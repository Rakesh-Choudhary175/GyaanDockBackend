const express = require('express');
const questionController = require('./../controllers/questionController');
const authController = require('./../controllers/authController');
const commentController = require('./../controllers/commentController');

const router = express.Router({ mergeParams: true });

//this line is to use /api/v1/question/ in get and post
router
    .route('/')
    .get(commentController.getAllComment)
    .post(authController.protect, authController.restrictTo('user'), commentController.createComment);




module.exports = router;