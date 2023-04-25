const { default: mongoose } = require("mongoose");

const userScema = mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    phone : {
        type : String
    },
})

const user = mongoose.model("user",userScema)


module.exports = user