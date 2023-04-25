const express = require('express');
const router = express.Router();
const controller = require("../controller/admincontroller")
const {upload} = require("../middleware/multer");


router.get("/admin/deshboard",controller.deshboard);
router.get("/admin/login",controller.login);
router.post("/admin/postlogin",controller.postlogin);
router.get("/admin/addmovie",controller.addmovie);
router.post("/admin/addmovie_admin",upload,controller.addmovie_admin);
router.get('/deactiveStatus/:id',controller.deactiveStatus);
router.get('/activeStatus/:id',controller.activeStatus);
router.get("/admin/deletemovie/:id",controller.deletemovie);
router.get("/admin/updatedata/:id",controller.updatedata);
router.get("/admin/viewmovieadmin",controller.viewmovieadmin);
router.post("/admin/editmovie",upload,controller.editmovie);
router.get("/admin/viewuser",controller.viewuser);
router.get("/admin/deleteuser/:id",controller.deleteuser);

router.get("/admin/logout",controller.logout);

module.exports = router