const express = require('express');
const questionController = require('./../controllers/questionController');
const authController = require('./../controllers/authController');
const commentController = require('./../controllers/commentController');



const router = express.Router();

router.route('/:questionid/comment')
    .get(commentController.getAllComment)
    .post(authController.protect, authController.restrictTo('user'), commentController.createComment);


//this line is to use /api/v1/question/ in get and post
router
    .route('/')
    .get(questionController.getAllQuestion)
    .post(authController.protect, authController.restrictTo('admin'), questionController.createQuestion);

//this line is to use /api/v1/question/solved in get and post
router
    .route('/solved')
    .get(authController.protect, questionController.solvedQuestion);

//this line is to use /api/v1/question/unsolved in get and post
router
    .route('/unsolved')
    .get(authController.protect, questionController.unsolvedQuestion);


// this line is to use /api/v1/question/:id in get, patch and delete
router
    .route('/:id')
    .get(authController.protect, questionController.getOneQuestion)
    .patch(authController.protect, authController.restrictTo('admin'), questionController.updateQuestion)
    .delete(authController.protect, authController.restrictTo('admin'), questionController.deleteQuestion);

router
    .route('/:id/submit')
    .patch(authController.protect, questionController.submitQuestion);


module.exports = router;