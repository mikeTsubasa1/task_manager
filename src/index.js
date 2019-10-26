const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const task = require('./models/tasks');
const _ = require('lodash');
const userRouter = require('./router/user');
const taskRouter = require('./router/task')

const app = express();

const port = process.env.PORT || 3000;

// app.use((req,res,next)=>{
//     if(req.method == 'GET')    
//     {
//         res.send("GET requests NOT ALLOWED!!");
//     }
//     next();
// })


// app.use((req,res,next)=>{
//     res.status(503).send("site under maintanence.please come back later!!");
// })


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.get('*',async (req,res)=>{
    res.send('route not found!!')
})

app.post('*',async (req,res)=>{
    res.send('route not found!!')
})

app.listen(port,()=>{
    console.log("app running on port " + port);
})


