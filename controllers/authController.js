const { promisify } = require('util');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'Success',
        token,
        data: {
            user
        }
    });
}

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body);
        createSendToken(newUser, 201, res);

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};


exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // 1) check if email and password exist
        if (!email || !password) {
            return next(res.status(404).json({
                status: 'fail',
                message: `no email or password`
            }));
        }
        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email: email }).select('+password');


        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or password'
            }));
        }
        // 3) If everyting ok, send token to client 
        createSendToken(user, 200, res);

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.protect = async (req, res, next) => {
    try {
        // 1) Getting token nad check of it's there 
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        if (!token) {
            return next(res.status(401).json({
                status: 'fail',
                message: 'You are not logged in! Please log in to get access.'
            }));
        }
        // 2) Vaildate token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentuser = await User.findById(decoded.id);
        if (!currentuser) {
            return next(res.status(401).json({
                status: 'fail',
                message: 'The user beloning to this token does no longer exist'
            }));
        }

        // 4) Check if user changed password after the token was issued
        if (currentuser.changedPasswordAfter(decoded.iat)) {
            return next(res.status(401).json({
                status: 'fail',
                message: 'User recently changed password! Please Log in again'
            }));
        }

        // // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentuser;
        res.locals.user = currentuser;
        next();
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: 'Something went wrong plz login again'
        });
    }
};



exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            }));
        }

        next();
    };
};



exports.updatePassword = (async (req, res, next) => {
    try {
        // 1) Get user from collection
        const user = await User.findById(req.user.id).select('+password');
        // 2) Check if POSTed current password is correct
        if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
            return next(res.status(401).json({
                status: 'fail',
                message: 'Your current password is wrong.'
            }));
        }
        // 3) If so, update password
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();

        // 4) Log user in, send JWT
        createSendToken(user, 200, res);
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err
        });
    }
});