const express = require('express');
const admin = require("../model/admin");
const movie = require("../model/addmovie");
const user = require("../model/user");
// const movie = require("../model/addmovie");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AVATAR_PATH = ("/upload/poster/");
const path = require("path");
const fs = require("fs");

(async function defaultregister(req, res) {
    try {
        const admindata = {
            email: "admin@gmail.com",
            password: "admin@123"
        }

        const finddata = await admin.findOne({ email: admindata.email })
        if (finddata) {
            return
        }
        const bpass = await bcrypt.hash(admindata.password, 10)
        const adminrecord = new admin({
            ...admindata,
            password: bpass
        })
        adminrecord.save()
    } catch (error) {
        console.log(error, "something went wrong");
    }
})()

async function deshboard(req, res) {
    return res.render("deshboard")

}

async function login(req, res) {
    return res.render("adminlogin")
}

async function postlogin(req, res) {
    try {
        const findemail = await admin.findOne({ email: req.body.email });
        if (findemail) {
            const compass = await bcrypt.compare(req.body.password, findemail.password)
            if (compass === true) {
                const token = jwt.sign({ findemail }, "code")
                res.cookie('admin', token)
                console.log("login successfully");
                return res.redirect("/admin/deshboard")
            }
            else {
                console.log("password is incorrect");
                return res.redirect("/admin/login")
            }
        }
        else {
            console.log("please enter valid email");
            return res.redirect("/admin/login")

        }
    } catch (error) {
        console.log("something went wrong", +error);
        return res.redirect("/admin/login")
    }
}

async function addmovie(req, res) {
    return res.render("addmovie")
}

async function addmovie_admin(req, res) {
    try {
        // console.log(req.body)
        // console.log(req.file)
        const imagedata = path.join(AVATAR_PATH, req.file.filename)
        const addmovie = movie({
            title: req.body.title,
            text: req.body.text,
            year: req.body.year,
            type: req.body.type,
            quelity: req.body.quelity,
            poster: imagedata,
            isactive: 1
        })
        addmovie.save()
        console.log("movie added successfully");
        return res.redirect("/admin/deshboard")
    } catch (error) {
        console.log("something went wrong");
    }

}
async function deactiveStatus(req, res) {
    console.log(req.params.id);
    await movie.findByIdAndUpdate(req.params.id, {
        isactive: 0
    })
    return res.redirect('back')
}

async function activeStatus(req, res) {
    console.log(req.params.id);

    await movie.findByIdAndUpdate(req.params.id, {
        isactive: 1
    })
    return res.redirect('back');
}

async function viewmovieadmin(req, res) {
    let activeData = await movie.find({ "isactive": 1 });
    let deactiveData = await movie.find({ 'isactive': 0 });
    return res.render('viewmovieadmin', {
        activeData: activeData,
        deactiveData: deactiveData
    })
}

async function deletemovie(req, res) {
    console.log(req.params.id);
    const finddata = await movie.findByIdAndDelete(req.params.id)
    if (!finddata) {
        res.redirect("/admin/viewmovieadmin")
    }
    res.redirect("/admin/viewmovieadmin")

}

async function deleteuser(req, res) {
    console.log(req.params.id);
    const finddata = await user.findByIdAndDelete(req.params.id)
    if (!finddata) {
        res.redirect("/admin/viewuser")
    }
    res.redirect("/admin/viewuser")

}

async function updatedata(req, res) {
    try {
        let data = await movie.findOne({ _id: req.params.id });
        console.log(data);
        if (data) {
            return res.render('updatemovie', {
                'record': data
            });
        }
        else {
            console.log("record not found");
            return res.redirect('/admin/viewmovieadmin');
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('/admin/viewmovieadmin');
    }

}


//   //-------------------------------------------- editdataprofile
async function editmovie(req, res) {
    console.log(req.file);

    if (req.file) {
        const finddata = await movie.findById(req.body.editid)

        if (finddata.poster) {
            fs.unlinkSync(path.join(__dirname, "..", finddata.poster));
        }

        const imagedata = path.join(AVATAR_PATH, req.file.filename)
        req.body.poster = imagedata;
        const updatedata = await movie.findByIdAndUpdate(req.body.editid,
            req.body,
        )
        if (updatedata) {
            console.log("data updated successfully");
            return res.redirect('/admin/viewmovieadmin');
        }
        else {
            console.log("data not updated ");
            return res.redirect('/admin/editmovie');
        }

    }
    else {
        const finddata = await movie.findById(req.body.editid)
        var imagePath = '';
        if (finddata.poster) {
            imagePath = finddata.poster;
        }
        req.body.poster = imagePath;
        const updatedata = await movie.findByIdAndUpdate(req.body.editid,
            req.body,)

        if (updatedata) {
            console.log("data updated successfully");
            return res.redirect('/admin/viewmovieadmin');
        }
        else {
            console.log("data not updated ");
            return res.redirect('/admin/editmovie');
        }

    }
}

async function viewuser(req, res) {
    const record = await user.find({})


    let search = '';

    if (req.query.search) {
        search = req.query.search
    }

    var page = 1;
    if (req.query.page) {
        page = req.query.page
    }

    var per_page = 2;

    let AdminData = await user.find({
        $or: [
            { name: { $regex: '.*' + search + '.*' } },
            { email: { $regex: '.*' + search + '.*' } }
        ]
    })
        .skip((page - 1) * per_page)
        .limit(per_page)
        .exec();

    let CountData = await user.find({
        $or: [
            { name: { $regex: '.*' + search + '.*' } },
            { email: { $regex: '.*' + search + '.*' } }
        ]
    }).countDocuments();


    console.log(AdminData);
    return res.render('viewuser', {
        'adminRecord': AdminData,
        'countRecord': Math.ceil(CountData / per_page),
        'searchData': search,
        "currentPage": page,
        "next": page + 1,
        "prev": page - 1,
        record: record
    });
    // return res.render("viewuser",{
    //     record: record
    // })
}

async function logout(req, res) {
    res.cookie('admin', "")
    return res.redirect("/admin/login")
}

module.exports = {
    login,
    postlogin,
    deshboard,
    addmovie,
    addmovie_admin,
    viewmovieadmin,
    deactiveStatus,
    activeStatus,
    deletemovie,
    updatedata,
    editmovie,
    logout,
    viewuser,
    deleteuser
}