const { Router } = require("express");

//Local Imports
const {
  getApplicationDetails,
  createApplicationDetails,
} = require("../controllers/cred/applicationController");

const router = Router();

router.route("/").get(getApplicationDetails).post(createApplicationDetails);

module.exports = router;
