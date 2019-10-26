const mongoose = require('mongoose');

try{
    const connectionURL = 'mongodb+srv://mike:miketsubasa96@cluster0-p6gzv.mongodb.net/task-manager?retryWrites=true';
    mongoose.connect(connectionURL,{
        useNewUrlParser : true,
        useCreateIndex : true,
        useFindAndModify: false
    });
}catch(error){
    console.log(process.env);
    console.log(error);
    throw error;
}




