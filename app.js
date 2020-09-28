const express     = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    mongoose      = require("mongoose"),
    User          = require("./models/user"),
    dotenv        = require('dotenv'),
    methodOverride = require("method-override");

    var indexRoute    = require("./routes/index"),
    companyRoute = require("./routes/company"),
    applicantRoute = require("./routes/applicant");

    dotenv.config();

const mongoURI = process.env.MONGO_URI
console.log(mongoURI)

mongoose.connect(mongoURI, { 
  useNewUrlParser: true, useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: true }));
    
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
    
//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret:"I am in Lovely",
  resave: false,
  saveUninitialized: false
}));
    
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use("/", indexRoute);
app.use("/company", companyRoute);
app.use("/applicant", applicantRoute);

app.listen(process.env.PORT || 4000, function(){
	console.log("server has started!");
});