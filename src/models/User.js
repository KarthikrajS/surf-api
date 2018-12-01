import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';


const schema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        lowercase: true,
        index: true,
        unique: true
    },
    passwordHash:{
        type:String,
        required:true
    },
    confirmed:{
        type: Boolean,
        default: false
    },
    confirmationToken:{
        type: String,
        default:""
    }
},{timestamp: true});

schema.methods.generateJWT = function generateJWT(){
    return jwt.sign({
        email: this.email,
    },process.env.JWT_SECRET)
}
schema.methods.setConfirmationToken = function setConfirmationToken() {
    this.confirmationToken = this.generateJWT();
};
schema.methods.generateConfirmationurl= function generateConfirmationurl(){
    return `${process.env.HOST}/confirmation/${this.confirmationToken}`
};


schema.methods.setPassword = function setPassword(password) {
    this.passwordHash = bcrypt.hashSync(password,10);
};

schema.methods.generateResetPasswordToken = function generateResetPasswordToken(){
    return jwt.sign({
            _id : this._id
        },process.env.JWT_SECRET,
        {expiresIn: "1h"}
    )};

schema.methods.generateResetPasswordLink = function generateResetPasswordLink(){
    return `${process.env.HOST}/reset_password/${this.generateResetPasswordToken()}`
};


schema.methods.isValidPassword = function isValidPassword(password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

schema.methods.toAuthJSON = function toAuthJSON() {
    return  {
        email: this.email,
        confirmed: this.confirmed,
        token: this.generateJWT()
    }
}
schema.plugin(uniqueValidator,{message:'This email is already taken!'});
export default mongoose.model('User',schema);