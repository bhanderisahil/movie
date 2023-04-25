const user = require("../model/user");
const movie = require("../model/addmovie");
const add = require("../model/addtocart")
const jwt = require("jsonwebtoken");
async function register(req, res) {
    res.render("register")
}
async function userdeshboard(req, res) {

    let search = '';

    if (req.query.search) {
        search = req.query.search
    }

    let record = await movie.find({
        $or: [
            { title: { $regex: '.*' + search + '.*' } }
        ]
    })


    return res.render('userdeshboard', {
        record: record
    })

    // return res.render("userdeshboard", {
    //     record: record
    // })
}
async function userregister(req, res) {
    const findemail = await user.findOne({ email: req.body.email });
    if (!findemail) {
        const userdata = new user(req.body);
        userdata.save()
        if (user) {
            console.log("user registerd successfully");
            return res.redirect("/")
        }
        else {
            console.log("something went wrong")
        }
    }
    else {
        console.log("user already registered");
        return res.redirect("/register");
    }

}

async function login(req, res) {
    return res.render("userlogin")
}
async function userlogin(req, res) {
    console.log(req.body.email);
    try {
        const findemail = await user.findOne({ email: req.body.email });
        if (findemail) {
            if (findemail.password == req.body.password) {
                const token = jwt.sign({ findemail }, "code")
                res.cookie('user', token)
                console.log("login successfully");
                return res.redirect("/userdeshboard")
            }
            else {
                console.log("password is incorrect");
                return res.redirect("/")
            }
        }
        else {
            console.log("please enter valid email");
            return res.redirect("/")

        }
    } catch (error) {
        console.log(error);
        console.log("something went wrong", +error);
        return res.redirect("/")
    }
}

async function resetpass(req, res) {
    return res.render("resetpassword")
}
async function resetpassdata(req, res) {
    console.log(req.cookies.user);
    const tokendecode = await jwt.verify(req.cookies.user, "code")
    console.log(tokendecode);
    const datafind = await user.findOne({ email: tokendecode.findemail.email })
    if (datafind) {
        if (req.body.oldpass === datafind.password) {
            if (req.body.newpass === req.body.confirmpass) {
                const data = await user.findOneAndUpdate({ email: datafind.email }, { password: req.body.newpass });
                if (data) {
                    console.log("password updated successfully");
                    return res.redirect("/")
                }
                else {
                    console.log("something went wrong");
                    return res.redirect("/resetpass")
                }
            }
            else {
                console.log("password do not match conform password");
                return res.redirect("/resetpass")

            }
        }
        else {
            console.log("your password is wrong");
            return res.redirect("/resetpass")
        }
    }
    else {
        console.log("record not found");
        return res.redirect("/resetpass")
    }

}

async function profile(req, res) {
    const tokendecode = await jwt.verify(req.cookies.user, "code");
    console.log(tokendecode);
    if (tokendecode) {
        return res.render("userprofile", {
            token: tokendecode
        })
    }
    else {
        console.log("something went wrong");
        return res.redirect("/userdeshboard")
    }
}
async function addcartpage(req, res) {
    const tokendecode = await jwt.verify(req.cookies.user, "code");

    let sessionData2 = []

    const userid = await add.findOne({ userid: tokendecode.findemail._id });
    console.log(userid);
    for (i = 0; i < userid.movieid.length; i++) {
        const findata = await movie.findById(userid.movieid[i]);

        sessionData2.push(findata)
    }
    return res.render("addtocart", {
        finddata: sessionData2
    })

}



async function addtocart(req, res) {
    console.log(req.params.id);
    const tokendecode = await jwt.verify(req.cookies.user, "code");
    // console.log(tokendecode.findemail._id);


    const userid = await add.findOne({ userid: tokendecode.findemail._id });

    if (userid) {
        console.log("alrady userid");
        const data = await add.findOne({ userid: tokendecode.findemail._id });
        const newarray = data.movieid
        const newdata = []
        for (x of newarray) {
            newdata.push(x);
        }
        newdata.push(req.params.id)

        await add.findOneAndUpdate({ userid: tokendecode.findemail._id }, {
            movieid: newdata
        })
        return res.redirect("/userdeshboard");
    }
    else {
        const create = await add.create({
            userid: tokendecode.findemail._id,
            movieid: req.params.id
        })
        return res.redirect("/userdeshboard")
    }

    // console.log(req.params.id,{
    //     movieid :req.params.id,
    //     userid :tokendecode.findemail.id
    // });
    // const data = await movie.findById(req.params.id);

}

async function viewmaxmovie(req, res) {
    try {

        const findmovie = await movie.findById(req.params.id);
        console.log(findmovie);
        res.render("viewmoviemax", {
            moviedetailes: findmovie
        });
    } catch (err) {
        console.log(err.message);
    }
    console.log(req.params.id);

}
async function logout(req, res) {
    res.cookie('user', "")
    return res.redirect("/")
}

module.exports = {
    register,
    userregister,
    userdeshboard,
    login,
    userlogin,
    logout,
    resetpass,
    resetpassdata,
    profile,
    addtocart,
    addcartpage,
    viewmaxmovie
}