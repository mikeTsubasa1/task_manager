const jwt = require('jsonwebtoken');
const User = require('../models/user');
const _ = require('lodash');
const jwtSecret = process.env.JWT_SECRET;

auth = async (req,res,next) => {
    try{
        let token = req.header('Authorization').replace('Bearer ','');
        console.log(token);
        let result = jwt.verify(token,jwtSecret);
        console.log(result);
        let user =  await User.findOne({_id : result._id,'tokens.token' : token})
        if(_.isEmpty(user))
            throw new Error();
        req.token = token;
        req.user = user;
        next();
    }catch(e){
        console.log(e);
        res.status(401).send('Please authenticate');
    }
    
    
}
module.exports = auth;