var mongoose = require("mongoose");

var applicantSchema = new mongoose.Schema({
	name: String,
  skills: [String],
  experience: Number,
  filename: String,
  resume: { 
    data: Buffer, 
    contentType: String 
  } ,
  email: String,
  jobSummary: String,
  location: String,
  role: String,
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: String
  },
  companies: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company"
    },
    companyName: String
    }
  ]
});

module.exports = mongoose.model("Applicant", applicantSchema);