const express = require("express");
const router = express.Router();

router.post("/CompareAppVersion", (req, res) => {
  console.log("/AppConfig/CompareAppVersion");
  res.send({ isSuccess: true });
});

module.exports = router;
