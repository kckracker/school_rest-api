// setup Express router
const express = require('express');
const router = express.Router();


const {User, Course} = require('../models');

// GET and POST routes for users
router.route('/users')
    .get(async (req, res) => {
        const currentUser = await User.findAll();
        res.status(200).json(currentUser);
    })
    .post(async (req, res, next) => {
        try{
            const newUser = await User.create(req.body);
            res.location('/').status(201);
        } catch(error) {
            if(error.name === 'SequelizeValidationError' || error === 'UniqueConstraintError'){
                res.status(400).json(error.errors);
            } else {
                next();
            }
        }
    });

// GET / PUT / POST / DELETE routes for courses
router.route('/courses')
    .get(async (req, res) => {
        const allCourses = await Course.findAll({include: User
        });
        res.json(allCourses);
    })
    .post(async (req, res, next) => {
        try{
            const newCourse = await Course.create(req.body);
            res.location(`./${newCourse.id}`).status(201);
        } catch(error) {
            if(error.name === 'SequelizeValidationError' || error === 'UniqueConstraintError'){
                console.log(req.body);
                res.status(400).json(error.errors);
            } else {
                next();
            }
        }
    })

router.route('/courses/:id')
    .get(async (req, res) => {
        const course = await Course.findOne({ where:{
            id: req.params.id
        }, include: User});
        res.status(200).json(course);
    })
    .put(async (req, res, next) => {
        try{
            const course = await Course.findOne({ where:{
                id: req.params.id
            }});
            course.title = req.params.name;
            course.description = req.params.description;
            course.estimatedTime = req.params.estimatedTime;
            course.materialsNeeded = req.params.materialsNeeded;
            await course.save();
            res.status(204).end();
        } catch(error) {
            if(error.name === 'SequelizeValidationError' || error === 'UniqueConstraintError'){
                res.status(400).json(error.errors);
            } else {
                next();
            }
        }
        
    })
    .delete(async (req, res) => {
        const course = await Course.findOne({ where:{
            id: req.params.id
        }});
        course.destroy();
        res.status(204).end();
    })

module.exports = router;