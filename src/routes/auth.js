import express from 'express';
import User from '../models/User';
import {sendResetPasswordEmail} from '../mailler'
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/',(req,res)=>{
    const {credentials} = req.body  ;
    User.findOne({email:credentials.email}).then(user=>{
        if(user && user.isValidPassword(credentials.password)) {
            res.json({user: user.toAuthJSON()});
        }
        else{
            res.status(400).json({errors:{global:"No account found for this email."}})
        }
    });
});
router.post("/reset_password_request",(req,res)=>{
    User.findOne({email : req.body.email}).then(user => {
        if(user){
            sendResetPasswordEmail(user);
            res.json({});
        }else{
            res.status(400).json({errors:{global:"Hey! Something went wrong"}});
        }
    });

});
router.post("/validate_token",(req,res)=> {
    jwt.verify(req.body.token,process.env.JWT_SECRET,err=>{
        if(err){
            res.status(401).json({token:req.body.token})
        }
        else{
            res.json({});
        }
    })
});

router.post("/reset_password",(req,res)=>{
    const{password,token} = req.body.data;
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            res.status(401).json({errors:{global:"Invalid Token"}});
        }else{
            User.findOne({_id:decoded._id})
                .then(user=>{
                    if(user){
                        user.setPassword(password);
                        user.save().then(()=>res.json({}));
                    }else{
                        res.status(404).json({errors:{global:"User not available"}});
                    }
                });
        }
    });
});
router.post("/confirmation",(req,res)=>{
    const token = req.body.token;
    User.findOneAndUpdate(
        {confirmationToken: token},
        {confirmationToken:"", confirmed:true}
    ).then(user=>{
        if(user){
            res.json({user: user.toAuthJSON()})
        }
        else res.status(400).json({})
    });
});


export default router;