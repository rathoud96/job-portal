var express = require("express"),
    router  = express.Router(),
    Company  = require("../models/company"),
    Applicant    = require("../models/applicant"),
    User    = require("../models/user"),
    passport  = require("passport");

router.get("/", function(req, res){
	Company.find({},function(err, allCompanies){
		if(err){
			console.log("error");
		}else{
      res.render("company/dashboard", {currentUser: req.user})
		}
	});
});

router.get("/register",function(req, res){
	res.render("companyRegister", {currentUser: req.user});
});

router.get("/:id/profile",function(req, res){
  Company.findById(req.params.id, function(err, company){
    res.render("company/profile", {company: company});
  })
});

router.post("/register",function(req, res){
  console.log(req.body)
  console.log(req.user)
  var newUser = new User({username: req.body.username, email: req.body.email,  userType: "recruiter"});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("companyRegister");
		}
	  passport.authenticate("local")(req, res, function(){
      var newCompany = new Company({name: req.body.username, companyName: req.body.companyName, creator: {
        id: user._id,
        name: user.username
      }})
      Company.create(newCompany, function(err, company){
        if(err){
          console.log("unable to register company")
          return res.render("companyRegister");
        }
        res.render("company/dashboard", {currentUser: user, company: company})
      })
		});
	});
});

router.put("/:id",function(req, res){
  if(req.user.userType != "recruiter"){
    Applicant.find({'user.id': req.user._id}, function(err, applicants){
      Company.findById(req.params.id, function(err, company){
        var applicant = {id: applicants[0]._id, name: applicants[0].name}
        console.log(applicant)
        company.applicants.push(applicant)
        company.save()
        res.render("applicant/profile", {currentUser: req.user, applicant: applicants[0]})
      })
    })
  }else{
    Company.findById(req.params.id, function(err, company){
      company.jobDescription = req.body.company.jobDescription
      company.location = req.body.company.location
      company.role = req.body.company.role
      company.companyName = req.body.company.companyName
      company.save()

      User.findById(company.creator.id, function(err, user){
        res.render("company/dashboard", {currentUser: user, company: company})
      })
    })
  }
});

module.exports = router