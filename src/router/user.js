const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const _ = require('lodash');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const mailer = require('../email/account');

const avatar = multer({
    limits : {
        fileSize: 1000000
    },
    fileFilter (req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
            cb(new Error('Please upload the correct file format'))
        }
        cb(undefined,true);
    }

})

router.post('/user',async (req,res)=>{
    let user1 = new User(req.body)
    try{
        let token = await user1.generateAuthToken();
        mailer.sendWelcomeMail(user1.email,user1.name);
        res.send({user1});
        res.end();
    
    }catch(error){
        console.log(error);
        res.status(500).send(error);
        res.end();
    }
})

router.post('/user/login',async (req,res)=>{
    try{
        let user = await User.getUserByCredentials(req.body.email,req.body.password);
        let token = await user.generateAuthToken();
        res.send({user,token});
    }catch(e){
        console.log(e);
        res.status(400).send();
    }
})

router.post('/user/logout',auth,async (req,res)=>{
    try{
        user = req.user;
        user.tokens = user.tokens.filter(token=> token.token != req.token);
        await user.save();
        res.send();
    }catch(e){
        console.log(e);
        res.status(500).send();
    }
})

router.post('/user/logoutAll',auth,async(req,res)=>{
    try{
        user = req.user;
        user.tokens = [];
        await user.save();
        res.send();
    }catch(e){
        console.log(e);
        res.status(500).send();
    }
})

router.get('/user/me',auth,async (req,res)=>{
    try{
        let result = await User.findOne({ _id : req.user._id});
        res.send(result);
    }catch(e){
        res.status(400).send(error);
    }
})

router.get('/user/:id',async (req,res)=>{
    const id = req.params.id;
    try{
        let user = await User.find({_id : id})
        if(_.isEmpty(user)){
            res.send({message:"user not found"});
        }
        res.send(user);
    }catch(error){
        res.status(400).send(error);
    }
})

router.patch('/user/me',auth,async (req,res)=>{
    let keys = _.keys(req.body);
    let allowedKeys = ['name','age','email','password'];
    let isValidRequest = keys.every((key)=>{
        return allowedKeys.includes(key);
    })
    try{
        if(!isValidRequest){
            return res.status(404).send('Invalid object keys found');
        }
        let user = req.user;
        console.log(user);
        let updateUser = req.body;
        _.forOwn(updateUser,(value,key)=>{user[key] = value;})
        let result = await user.save();
        res.send(result);
    }catch(e){
        console.log(e);
        res.status(400).send({e,message:'bad request'});
    }
})

router.delete('/user/me',auth,async (req,res)=>{
    try{
        let result = await req.user.remove();
        res.send(result);
        res.end();
        mailer.sendCancellationMail(result.email,result.name);
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    }
})

router.post('/user/me/avatar',auth,avatar.single('avatar'),async (req,res)=>{
    req.user.avatar = await  sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    await req.user.save();
    res.send();
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
})

router.delete('/user/me/avatar',auth,async (req,res)=>{
    try{
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    }catch(e){
        console.log(e);
        res.status(500).send();
    }
})

router.get('/user/:id/avatar',async (req,res)=>{
    try{
        let user = await User.findById(req.params.id);
        console.log('========================================================================================================================');
        console.log(user);
        console.log('========================================================================================================================');
        if(!user || !user.avatar){
            throw new Error('user not found');
        }
        res.set('Content-Type','image/png').send(user.avatar);
    }catch(e){
        console.log(e);
        res.status(404).send();
    }
})



module.exports = router