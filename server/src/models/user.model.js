const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"Username already taken"],
        required:true,
    },
    email:{
        type:String,
        unique:[true,"Account already exist"],
        required:true
    },
    password:{
        type:String,
        required:true
    },
    bio: {
        type: String,
        default: ""
    },
    targetTitle: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    linkedin: {
        type: String,
        default: ""
    },
    github: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

const userModel=mongoose.model("users",userSchema)

module.exports= userModel