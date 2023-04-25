const multer = require("multer");
const AVATAR_PATH = ("/upload/poster");
const path = require("path")

console.log("-----------------------upload----------------------");

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", AVATAR_PATH))
    },
    filename: function (req, file, cb) {
        console.log(req.file);
        cb(null, file.fieldname + '-' + Date.now())
    }

})

const upload = multer({ storage: storage }).single("poster");

module.exports = {upload}


