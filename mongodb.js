// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
const { MongoClient,ObjectID } = require('mongodb');
const connectionURL = process.env.MONGODB_URL;
const databaseName = 'task-manager';


// const id = new ObjectID();
// console.log(id);
// console.log(id.toHexString());
// console.log(id.toHexString().length);
// console.log(id.id.length);

MongoClient.connect(connectionURL,{ useNewUrlParser : true },(error,client)=>{
    if(error){
        return console.log("couldnot connect to the database");
    }
    console.log("connected to the database successfully");
    const db = client.db(databaseName);
    // db.collection('users').insertOne({
    //     "name" : "tsubasa",
    //     "age" : 23
    // })

    // db.collection('users').insertMany([
    //     { name: 'naruto', age: 23},
    //     { name: 'sasuke', age: 23}
    // ],(error,result)=>{
    //     if(error)
    //     {
    //         console.log("error occurred in insert many in collectio users");
    //         return console.log(error);
    //     }
    //     console.log(result.ops);
    // })

    // db.collection('tasks').insertMany([
    //     { description: 'nodejs', completed: false},
    //     {description: 'payment-service',completed:true}
    // ],(error,result)=>{
    //     if(error)
    //     {
    //         console.log("error occurred in insertmany of tasks collection");
    //         return console.log(error);
    //     }
    //     console.log(result.ops);
        
    // })

    // db.collection('tasks').findOne({_id : new ObjectID("5daab3fed413b5175f6d387d")},(error,task)=>{
    //     console.log(task);
    // })
    // db.collection('tasks').find({completed:false}).count((error,count)=>{
    //     if(error)
    //         return console.log("error" + error);
    //     console.log(count);
    // })
    // db.collection('tasks').find({completed:false}).toArray((error,result)=>{
    //     if(error)
    //         return console.log("error" + error);
    //     console.log(result);
    // })
    // db.collection('tasks').updateMany(
    //     { completed : false},
    //     { $set : {completed : true }}
    //     ).then((result)=>{console.log(JSON.stringify(result, null, 2));})
    //     .catch((error)=>{console.log(JSON.stringify(error, null, 2));})

    db.collection('tasks').deleteOne({description:'nodejs'})
    .then((result)=>{console.log(result);})
    .catch((error)=>{console.log(error);})

    db.collection('users').deleteMany({age : 23})
        .then((result)=>{console.log(result);})
        .catch((error)=>{console.log(error);})

    
});