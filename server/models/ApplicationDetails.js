const mongoose = require("mongoose");

const ApplicationDetailsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  applicationName: {
    type: String,
    required: true,
  },
  borrowersName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  aadharNumber: {
    type: String,
    required: true,
  },
  panNumber: {
    type: String,
    required: true,
  },
  creditAssessmentReport: {
    type: String,
    required: false,
  },
});

const ApplicationDetails = mongoose.model(
  "ApplicationDetails",
  ApplicationDetailsSchema
);

module.exports = ApplicationDetails;
