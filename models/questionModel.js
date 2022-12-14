const Mongoose = require("mongoose");

const questionSchema = new Mongoose.Schema({
    title: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'A Question must have a title']
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'A Question must have a description']
    },
    category: {
        type: String,
        trim: true,
        required: [true, 'A question must have a category']
    },
    difficulty: {
        type: String,
        required: [true, 'A Question must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'hard'],
            message: 'Difficulty is either: easy, medium, hard'
        }
    },
    score: {
        type: Number,
        required: [true, 'A Question must have score']
    },
    example: {
        type: String,
        trim: true
    },
    input_format: {
        type: String,
        trim: true
    },
    output_format: {
        type: String,
        trim: true
    },
    sample_input: {
        type: String,
        trim: true
    },
    sample_output: {
        type: String,
        trim: true
    },
    test_case: {
        type: String,
        trim: true,
    },
    test_result: {
        type: String,
        trim: true,
        required: [true, 'A Question must have test result']
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual populate
questionSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'question',
    localField: '_id'
});



const Question = Mongoose.model('Question', questionSchema);


module.exports = Question;