const { default: mongoose } = require("mongoose");
const movieScema = new mongoose.Schema({
    title: {
        type: String
    },
    text: {
        type: String
    },
    year: {
        type: String
    },
    type: {
        type: String
    },
    quelity: {
        type: String
    },
    poster: {
        type: String
    },
    isactive: {
        type: Number
    }
})

const movie = mongoose.model("movie", movieScema)
module.exports = movie