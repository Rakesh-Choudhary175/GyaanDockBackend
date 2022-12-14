const Comment = require('./../models/commentModel');


exports.getAllComment = async (req, res, next) => {
    try {
        let filter = {}
        if (req.params.questionid) filter = { question: req.params.questionid };

        const comment = await Comment.find(filter);

        res.status(200).json({
            status: 'success',
            results: comment.length,
            data: {
                comment
            }

        });

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};


exports.createComment = async (req, res, next) => {
    try {
        if (!req.body.question) req.body.question = req.params.questionid;
        if (!req.body.user) req.body.user = req.user.id;

        const newComment = await Comment.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                comment: newComment
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};