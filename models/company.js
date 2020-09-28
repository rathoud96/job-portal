var mongoose = require("mongoose");

var CompanySchema = new mongoose.Schema({
  name: String,
  companyName: String,
  mobileNumber: String,
  location: String,
	role: String,
  jobDescription: String,
  applicants: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Applicant"
      },
      name: String,
      stage: String,
      feedback: String
    }
  ],
  creator: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: String
  }
});

module.exports = mongoose.model("company", CompanySchema);