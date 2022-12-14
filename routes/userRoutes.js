const express = require('express');
// const { router } = require('../app');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');



const Router = express.Router();

Router.post('/signup', authController.signup);
Router.post('/login', authController.login);
// Router.get('/logout', authController.logout);

// Router.post('/forgetPassword', authController.forgetPassword);
// Router.patch('/resetPassword/:token', authController.resetPassword);


//Protect all Routes after this middle ware
Router.use(authController.protect);

Router.patch('/updateMyPassword', authController.updatePassword);

// Router.get('/me', userController.getMe, userController.getUser)

Router.patch('/updateMe', userController.updateMe);
// Router.delete('/deleteMe', userController.deleteMe);

// Router.use(authController.restrictTo('admin'));

Router
    .route('/')
    .get(userController.getAllUser);
// .post(userController.createUser);

// Router
//     .route('/:id')
//     .get(userController.getUser)
//     .patch(userController.updateUser)
//     .delete(userController.deleteUser);


module.exports = Router;