import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import auth from './routes/auth'
import dotenv from 'dotenv';
import Promise from 'bluebird';

dotenv.config();
const app = express();
app.use(bodyParser.json());
mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URL,{useMongoClient: true});

app.use('/api/auth',auth);

app.get('/*',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});

app.listen(8083,()=>console.log("server is running on localhost:8083"));