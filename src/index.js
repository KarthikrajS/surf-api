import express from 'express';
import path from 'path';

const app = express();

app.post('/api/auth',(req,res)=>{
    res.status(400).json({errors:{global:"Invalid Credentials"}});
});

app.get('/*',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});

app.listen(8083,()=>console.log("server is running on localhost:8083"));