const Mongoose = require('mongoose');
// validator is use to validate any datatype like emial and all must install before use
const validator = require('validator');
const Question = require('./questionModel');
// bcrypt is use to incript password field must install bcrypt 
const bcrypt = require('bcryptjs');

// User_name
// User_email
// User_photo
// User_solved_question
// User_score
// User_role: user, admin
// User_education
// User_work_experience
// Password
// passwordConfirm


const userSchema = new Mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    solvedQuestion: [
        {
            type: Mongoose.Schema.ObjectId,
            ref: 'Question'
        }
    ],
    score: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    education: {
        type: String,
        trim: true
    },
    workExperience: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Password are not the same!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.pre('save', async function (next) {
    //only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}


const User = Mongoose.model('User', userSchema);

module.exports = User;