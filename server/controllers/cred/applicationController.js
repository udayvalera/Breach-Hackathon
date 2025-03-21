const ApplicationDetails = require("../../models/ApplicationDetails");

const getApplicationDetails = async (req, res) => {
  const { userId } = req.body;
  try {
    const applicationDetails = await ApplicationDetails.find({ userId });
    res.status(200).json(applicationDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createApplicationDetails = async (req, res) => {
  const { userId, applicationName, borrowersName, description } = req.body;

  try {
    const applicationDetails = await ApplicationDetails.create({
      userId,
      applicationName,
      borrowersName,
      description,
      aadharNumber,
      panNumber,
      creditAssessmentReport,
    });
    res.status(200).json(applicationDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getApplicationDetails,
  createApplicationDetails,
};
