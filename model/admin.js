const { default: mongoose } = require("mongoose");

const adminScema = mongoose.Schema({
    email : {
        type : String
    },
    password : {
        type: String
    },
    role : {
        type : String,
        default : "admin"
    }
})

const admin  = mongoose.model("admin", adminScema)
module.exports = admin