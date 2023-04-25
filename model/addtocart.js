const mongoose = require('mongoose');

const addtocart = mongoose.Schema({
    userid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    movieid : [
       
    ]
})

const add = mongoose.model("add",addtocart);


module.exports = add