const express = require('express');
const router = new express.Router();
const task = require('../models/tasks');
const User = require('../models/user');
const _ = require('lodash');

router.post('/task',auth,async (req,res)=>{
    let task1 = new task(req.body)
    try{
        task1.owner = req.user._id;
        let result = await task1.save();
        res.send(result);
    }catch(e){
        res.status(500).send(error);
    }
})

router.get('/task',auth,async (req,res)=>{
    try{
        let completed = req.query.completed;
        let match = {};
        let sort = {};
        if(completed)
        {
            match.completed = completed == 'true';
        }
        if(req.query.sort){
            let parts = req.query.sort.split(':');
            sort[parts[0]] =  parts[1] === 'desc' ? -1 : 1;
        }
        let user = await User.findById(req.user._id);
        await user.populate({
            path: 'mytasks',
            match,
            options:{
                limit : parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(user.mytasks);
    }catch(e){
        res.status(400).send(error);
    }
})


router.get('/task/:id',auth,async (req,res)=>{
    try{
        const id = req.params.id;

        let task1 = await task.findOne({ _id : id,owner: req.user._id})
        console.log(req.user);
        console.log(task1);
        if(_.isEmpty(task1)){
            return res.status(404).send();
        }
        res.send(task1);
    }catch(e){
        console.log(e);
        res.status(400).send(error);
    }
})

router.patch('/task/:id',auth,async (req,res)=>{
    const id = req.params.id;
    let keys = _.keys(req.body);
    let allowedKeys = ['description','completed'];
    let isValidRequest = keys.every((key)=>{
        return allowedKeys.includes(key);
    })
    try{
        if(!isValidRequest){
            return res.status(404).send('Invalid object keys found');
        }
        let task1 = await task.findOne({_id:id,owner:req.user._id});;
        if(_.isEmpty(task1))
        {
            return res.status(404).send('task not found');
        }
        _.forOwn(req.body,(value,key)=>{
            task1[key] = req.body[key];
        })
        let result = await task1.save();
        res.send(result);
    }catch(e){
        console.log(e);
        res.status(400).send({e,message:'bad request'});
    }
})

router.delete('/task/:id',auth,async (req,res)=>{
    try{
        let task1 = await task.findOne({_id : req.params.id, owner: req.user._id});    
        if(_.isEmpty(task1)){
            return res.status(404).send();
        }
        res.send(task1);
    }catch(e){
        res.status(500).send(e);
        console.log(e);
    }
})

module.exports = router