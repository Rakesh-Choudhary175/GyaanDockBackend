const Question = require('./../models/questionModel');
const User = require('./../models/userModel');

exports.getAllQuestion = async (req, res) => {
    try {
        const question = await Question.find(req.query);



        res.status(200).json({
            status: 'success',
            results: question.length,
            data: {
                question
            }

        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }

};

exports.createQuestion = async (req, res) => {
    try {
        const newQuestion = await Question.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                question: newQuestion
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

// this down code is for updating question and use question_id for it to update
exports.getOneQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id).populate('comments');
        res.status(200).json({
            status: 'Success',
            data: {
                question
            }
        });

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid id!'
        });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {

        await Question.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid id!'
        });
    }
};

exports.updateQuestion = async (req, res) => {
    try {

        const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                question
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Data updation failed'
        });
    }
};


exports.submitQuestion = async (req, res) => {
    try {

        // const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // });
        const question = await Question.findById(req.params.id);
        const user = await User.findById(req.user.id);
        if (!(user.solvedQuestion.find(element => element == req.params.id))) {
            user.solvedQuestion.push(req.params.id);
            user.score = user.score + question.score;
            // console.log(user);
            const updatedUser = await User.findByIdAndUpdate(req.user.id, user,
                { new: true, runValidators: true });

        }


        res.status(200).json({
            status: 'success',
            message: "Question has been submited succesfully"
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.solvedQuestion = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        const solvedQuestion = await user.solvedQuestion;
        const question = await Question.find({
            _id: {
                $in: solvedQuestion
            }
        });
        res.status(200).json({
            status: 'success',
            data: {
                question
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};


exports.unsolvedQuestion = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        const solvedQuestion = await user.solvedQuestion;
        const question = await Question.find({
            _id: {
                $nin: solvedQuestion
            }
        });
        res.status(200).json({
            status: 'success',
            data: {
                question
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};
