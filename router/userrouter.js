const express = require('express');
const { route } = require('./adminrouter');
const router = express.Router();
const usercontroller = require("../controller/usercontroller")

router.get("/register",usercontroller.register);
router.post("/userregister",usercontroller.userregister);

router.get("/",usercontroller.login);
router.post("/userlogin",usercontroller.userlogin)

router.get("/userdeshboard",usercontroller.userdeshboard);

router.get("/profile",usercontroller.profile);

router.get("/useraddtocart",usercontroller.addcartpage)
router.get("/add/:id",usercontroller.addtocart);

router.get("/resetpass",usercontroller.resetpass);
router.post("/resetdata",usercontroller.resetpassdata);

router.get("/viewmaxmovie/:id",usercontroller.viewmaxmovie);
router.get("/logoutuser",usercontroller.logout);
module.exports = router   