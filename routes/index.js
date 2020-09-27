var express = require("express"),
    router  = express.Router(),
    User    = require("../models/user"),
    Company  = require("../models/company"),
    Applicant  = require("../models/applicant"),
    passport  = require("passport");


router.get("/",function(req,res){
	res.render("home");
});

router.get("/register",function(req, res){
	res.render("register");
});

router.get("/login",function(req,res){
	res.render("login");
});

router.post("/login", passport.authenticate("local",{
		failureRedirect: "/login"
	}),function(req, res){
    if(req.user.userType == "recruiter"){
      Company.find({'creator.id': req.user._id}, function(err, company){
        console.log(company)
        res.render("company/dashboard", {currentUser: req.user, company: company[0]})
      })
    }else{
    Applicant.find({'user.id': req.user._id}, function(err, applicant){
      Company.find({}, function(err, companies){
        console.log(companies)
        res.render("applicant/dashboard", {currentUser: req.user, applicant: applicant[0], companies: companies})
      })
    })
  }
});

router.get("/logout",function(req, res){
	req.logout();
	res.redirect("/login");
});

function islogedin(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}else{
		res.redirect("/login");
	}
}

module.exports = router