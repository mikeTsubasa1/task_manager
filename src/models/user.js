
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = 'miketsubasa96@gmail.com';
const _ = require('lodash');
const tasks = require('./tasks');


const UserSchema = new mongoose.Schema({ 
    name : {
        type: String,
        required : true,
        trim : true,
        lowercase : true
    },
    age : {
        type : Number,
        default : 0,
        validate(age){
            if(age <= 0){
                throw new Error('Age should be positive!!')
            }
        }
    },
    email : {
        type : String,
        unique : true,
        required: true,
        validate(mail){
            if(!validator.isEmail(mail))
                throw new Error('INVALID EMAIL!!')
        },
        lowercase:true,
        trim : true
    },
    password : {
        type : String,
        required : true,
        minlength : 5,
        trim : true,
        validate(password){
            if(password.toLowerCase().includes('password')){
                throw new Error(`password should not contain the string 'password'`)
            }
        }
    },
    tokens : [{
        token : {
            type: String,
            required: true
        }
    }],
    avatar : {
        type : Buffer
    }
},{
    timestamps : true
});

UserSchema.virtual('mytasks',{
    ref: 'tasks',
    localField : '_id',
    foreignField: 'owner'
})
UserSchema.pre('save',function(next){
    if(this.isModified('password'))
        this.password = bcrypt.hashSync(this.password,8);
    console.log("pre save");
    next();
})

UserSchema.pre('remove',async function(next){
    const user = this;
    let task1 = await tasks.find({owner: user._id});
    console.log(task1);
    let taska = await tasks.deleteMany({owner: user._id});
    console.log("pre remove");
    console.log(taska);
    next();
})

UserSchema.methods.toJSON = function() {
    const user = this;
    userObject =  user.toObject();
    console.log("getpublicprofie" , user);
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    console.log("getpublicprofie" , userObject);
    return userObject;
}

UserSchema.methods.generateAuthToken = async function() {
    let user = this;
    let token = jwt.sign({_id : user._id.toString()},jwtSecret,{"expiresIn" : 12000 });
    user.tokens = user.tokens.concat({token});
    await user.save();
    console.log(token);
    return token;
}



UserSchema.statics.getUserByCredentials = async (email,password) => {
    let user = await User.findOne({email});
    if(_.isEmpty(user))
    {
        throw new Error('User authentication failed!!');
    }
    let isPasswordSame = bcrypt.compareSync(password,user.password);
    if(!isPasswordSame){
        throw new Error('User authentication failed!!');
    }
    return user;
}
const User =  mongoose.model('User',UserSchema)

module.exports = User;