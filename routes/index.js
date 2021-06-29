// setup Express router
const express = require('express');
const router = express.Router();
// import dependencies
const auth = require('basic-auth');
const bcrypt = require('bcrypt');

// Importing models from models folder
const {User, Course} = require('../models');

/**
 * Function to authorize user with email and password credentials. 
* @param {Object} req Accepts request opject for incoming request
* @param {Object} res Accepts response object representing server response to request
* @param {Function} next Accepts next method to push the request to next function.
    * 
    * Provides request object to imported 'auth' method from 'basic-auth' package which parses headers to supply new object with name and pass props if valid.
    * 
    * If valid headers, imported 'compareSync' method called to compare object supplied by 'auth' method with database
    * 
    * Error messages supplied at each condition to provide accurate but vague failure message 
    */
const verifyUser = async (req, res, next) => {
    const credentials = auth(req);
    let message;
    if(credentials){
        const user = await User.findOne({
            where:{
                emailAddress: credentials.name
            }
        });
        if(user){
            const authenticated = bcrypt
                .compareSync(credentials.pass, user.password);
            if(authenticated){
                    req.currentUser = user;
            } else {
                message = {"msg": "Access denied"};
            }
        } else{
        message = {"msg": `Username not found for ${credentials.name}`};
        }
    } else{
        message = {"msg": "Authorization header not found."};
    }

    if(message){
        res.status(401).json(message);
    } else{
        next();
    }
}

// GET and POST routes for '/users'
    // GET filters request through verifyUser function. Next, it utilizes sequelize findOne method and filters unwanted data using 'attributes' and 'exclude' props
    // POST attempts sequelize create using request body and checks error to return model validation message if validation or constraint error
router.route('/users')
    .get(verifyUser, async (req, res) => {
        const currentUser = await User.findOne({
            where: {
                id: req.currentUser.id
            },
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            }
        }); 
        res.status(200).json(currentUser);
    })
    .post(async (req, res, next) => {
        try{
            const newUser = await User.create(req.body);
            res.location('/').status(201).end();
        } catch(error) {
            if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
                res.status(400).json(error.errors);
            } else {
                next(error);
            }
        }
    });


// GET and POST  routes for '/courses'
    // GET attempts to return courses using sequelize findAll and filters out unwanted data using the 'attributes' and 'exclude' props. Associated User pulled via eager loading 'include' prop
    // POST filters request through verifyUser function. Next, it attempts sequelize create using verified request body and checks error to return model validation message if validation or constraint error
router.route('/courses')
    .get(async (req, res, next) => {
        try{
            const allCourses = await Course.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: {
                    model: User,
                    attributes: {
                        exclude: ['password', 'createdAt', 'updatedAt']
                    }
                }
            });
            res.json(allCourses);
        } catch(error){
            next(error);
        }
    })
    .post(verifyUser, async (req, res, next) => {
        try{
            const newCourse = await Course.create(req.body);
            res.location(`/courses/${newCourse.id}`).status(201).end();
        } catch(error) {
            if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
                res.status(400).json(error.errors);
            } else {
                next(error);
            }
        }
    })

// GET, PUT, and DELETE routes for 'courses/:id'
    // GET attempts to return courses using sequelize findOne and filters out unwanted data using the 'attributes' and 'exclude' props. Associated User pulled via eager loading 'include' prop
    // PUT filters request through verifyUser function. Next, it attempts reassignment of data with request object info and updates the record with sequelize save method. Also, checks error to supply model validation message upon validate or constraint error.
    // DELETE filters request through verifyUser function. Next, it utilizes sequelize findOne method to match request param
router.route('/courses/:id')
    .get(async (req, res) => {
        try{
            const course = await Course.findOne({ 
                where:{
                id: req.params.id
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: {
                    model: User,
                    attributes: {
                        exclude: ['password', 'createdAt', 'updatedAt']
                    }
                }});
            res.status(200).json(course);
        } catch(error){
            if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
                res.status(400).json(error.errors);
            } else {
                next(error);
            }
        }
    })
    .put(verifyUser, async (req, res, next) => {
        try{
            const course = await Course.findOne({ 
                where:{
                    id: req.params.id
                }
            });
            if(course.userId !== req.currentUser.id){
                res.status(403).end();
            } else{
                course.title = req.body.title;
                course.description = req.body.description;
                course.estimatedTime = req.body.estimatedTime;
                course.materialsNeeded = req.body.materialsNeeded;
                await course.save();
                res.status(204).end();
            }
        } catch(error) {
            if(error.name === 'SequelizeValidationError' || error.name === 'UniqueConstraintError'){
                res.status(400).json(error.errors);
            } else {
                next(error);
            }
        }  
    })
    .delete(verifyUser, async (req, res, next) => {
        try{
            const course = await Course.findOne({ where:{
                id: req.params.id
            }});
            if(course.userId !== req.currentUser.id){
                res.status(403).end();
            } else{
            course.destroy();
            res.status(204).end();
            }
        } catch(error){
            next(error);
        }
    });

module.exports = router;