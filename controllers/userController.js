const User = require('./../models/userModel');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

exports.getAllUser = async (req, res) => {
    try {
        const user = await User.find();

        res.status(200).json({
            status: 'success',
            results: user.length,
            data: {
                user
            }

        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }

};

exports.updateMe = async (req, res, next) => {
    try {
        //Don't allow to update password here
        if (req.body.password || req.body.passwordConfirm) {
            return next(res.status(400).json({
                status: 'fail',
                message: 'You cannot change password here'
            }));
        }

        // updateing actual document data
        // body.role: 'admin'

        const filterBody = filterObj(req.body, 'name', 'email', 'education', 'workExperience');

        const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
            new: true,
            runValidators: true
        });


        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};




