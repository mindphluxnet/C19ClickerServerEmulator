const express = require("express");
const router = express.Router();
const db = require("./Database");

router.post("/ChangeName", (req, res) => {
  console.log("/SetPlayerData/ChangeName");
  var UDID = req.body.udid;
  var newName = req.body.name;
  db.update(
    { udid: UDID },
    { $set: { userName: newName } },
    {},
    function (err, numReplaced) {
      if (numReplaced != 0) {
        res.send({ success: true });
      } else {
        res.send({ success: false });
      }
    }
  );
});

router.post("/SetRTV", (req, res) => {
  console.log("/SetPlayerData/SetRTV");
  var UDID = req.body.UDID;
  var rtv = req.body.rtv;

  db.update(
    { udid: UDID },
    { $set: { RawMaterialCount_ResistanceToVirus: rtv } },
    {},
    function (err, numReplaced) {
      res.send({ unlocked: true });
    }
  );
});

router.post("/AddScore", (req, res) => {
  console.log("/SetPlayerData/AddScore");
  var UDID = req.body.UDID;
  var score = req.body.score;
  var rtv = req.body.rtv;

  db.update(
    { udid: UDID },
    { $set: { score: score, RawMaterialCount_ResistanceToVirus: rtv } },
    {},
    function (err, numReplaced) {
      res.send({ unlocked: true });
    }
  );
});

router.post("/SetEP", (req, res) => {
  console.log("/SetPlayerData/SetEP");
  var UDID = req.body.UDID;
  var ep = req.body.ep;

  db.update(
    { udid: UDID },
    { $set: { ep: ep } },
    {},
    function (err, numReplaced) {
      res.send({ unlocked: true });
    }
  );
});

router.post("/AdvanceRank", (req, res) => {
  console.log(req.body);
  var UDID = req.body.UDID;

  res.send({ isSuccess: true });
});

module.exports = router;
