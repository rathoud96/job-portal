var express = require("express"),
    router  = express.Router(),
    User = require("../models/user")
    Applicant  = require("../models/applicant"),
    mongoose = require("mongoose"),
    multer = require("multer"),
    GridFsStorage = require("multer-gridfs-storage"),
    Company  = require("../models/company"),
    passport  = require("passport");

const mongoURI = "mongodb://localhost/job_portal"
const upload = require("../middleware/upload");

router.get("/",function(req, res){
	Applicant.find({},function(err, allApplicants){
		if(err){
			console.log("error");
		}else{
      res.render("applicant/dashboard")
		}
	});
});

router.get("/register",function(req, res){
	res.render("applicantRegister");
});

router.get("/:id/profile",function(req, res){
  Applicant.findById(req.params.id, function(err, applicant){
    res.render("applicant/profile", {applicant: applicant});
  })
});

router.post("/register", function(req, res){
  var username = req.body.username;
  var email = req.body.email;
	var newUser = new User({username: username, email: email, userType: "applicant"});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("applicantRegister");
		}
    passport.authenticate("local")(req, res, function(){
      Applicant.create({name: username, email: email, user: {
        id: user._id,
        name: user.username
      }}, function(err, applicant){
        Company.find({}, function(err, companies){
          res.render("applicant/dashboard", {currentUser: req.user, applicant: applicant, companies: companies})
        })
      })
		});
	});
});

router.put("/:id",async function(req, res){
  console.log(req)
  await upload(req, res);
  // console.log(req.body);
  //   if (req.file == undefined) {
  //     return res.send(`You must select a file.`);
  //   }
  Applicant.findById(req.params.id, function(err, applicant){
    applicant.jobSummary = req.body.applicant.jobSummary
    applicant.location = req.body.applicant.location
    applicant.role = req.body.applicant.role
    applicant.resume = "filename.pdf"
    applicant.save()

    User.findById(applicant.user.id, function(err, user){
      Company.find({}, function(err, companies){
        res.render("applicant/dashboard", {currentUser: user, applicant: applicant, companies: companies})
      })
    })
  })
});

module.exports = router