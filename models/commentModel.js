const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'Comment can not be empty!']
    },
    code: {
        type: String,

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    question: {
        type: mongoose.Schema.ObjectId,
        ref: 'Question',
        required: [true, 'Comment must belong to a question.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Comment must have a user']
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

commentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name'
    });

    next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;


