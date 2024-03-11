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
    { $set: { RawMaterialCount_ResistanceToVirus: parseInt(rtv), last_activity: Date.now() } },
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
    { $set: { score: parseInt(score), RawMaterialCount_ResistanceToVirus: parseInt(rtv), last_activity: Date.now() } },
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
    { $set: { ep: parseInt(ep) } },
    {},
    function (err, numReplaced) {
      res.send({ unlocked: true });
    }
  );
});

router.post("/AdvanceRank", (req, res) => {
  var UDID = req.body.UDID;
  db.update({ udid: UDID }, { $inc: { rank: 1 } }, {}, function (err, numReplaced) {
    res.send({ isSuccess: true });
  });
});

module.exports = router;
