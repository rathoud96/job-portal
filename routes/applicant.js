var express = require("express"),
    router  = express.Router(),
    User = require("../models/user")
    Applicant  = require("../models/applicant"),
    mongoose = require("mongoose"),
    multer = require("multer"),
    Company  = require("../models/company"),
    fs = require('fs'),
    passport  = require("passport")
    multer = require("multer"),
    path = require('path'); 

var storage = multer.diskStorage({
  destination: './resume/',
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now()+ '.pdf')
  }
})

const upload = multer({ storage: storage });

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

router.put("/:id", upload.single('file'), function(req, res){
  console.log(req.file)
  Applicant.findById(req.params.id, function(err, applicant){
    if(req.file){
    applicant.resume = {
      data: fs.readFileSync(path.join(__dirname, '../', '/resume/' + req.file.filename)),
      contentType: 'application/pdf'
    }}
    applicant.jobSummary = req.body.applicant.jobSummary
    applicant.location = req.body.applicant.location
    applicant.role = req.body.applicant.role
    applicant.save()

    User.findById(applicant.user.id, function(err, user){
      Company.find({}, function(err, companies){
        res.render("applicant/dashboard", {currentUser: user, applicant: applicant, companies: companies})
      })
    })
  })
});

router.get("/:id/resume", function(req, res){
  Applicant.findById(req.params.id, function(err, applicant){
    res.contentType(applicant.resume.contentType);
    res.send(applicant.resume.data);
  });
})

module.exports = router