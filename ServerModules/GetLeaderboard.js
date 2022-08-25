const express = require("express");
const router = express.Router();
const db = require("./Database");

router.post("/", (req, res) => {
  console.log("/GetLeaderboard");
  var count = req.body.count;
  var offset = req.body.offset;
  var leaderboard = GenerateLeaderboard(count, offset);
  res.send(leaderboard);
});

router.post("/GetUserRowNumber", (req, res) => {
  console.log("/GetLeaderboard/GetUserRowNumber");
  var UDID = req.body.UDID;
  var number = GetLeaderboardRowNumber(UDID);
  if (number > 0) {
    res.send({ isSuccess: true, message: number });
  } else {
    res.send({ isSuccess: false });
  }
});

function GenerateLeaderboard(count, offset) {
  var leaderboard = [];

  db.find({})
    .sort({ score: 1 })
    .skip(offset)
    .limit(count)
    .exec(function (err, docs) {
      for (var i = 0; i < docs.count; i++) {
        leaderboard.push({
          rank: docs[i].rank,
          name: docs[i].userName,
          score: docs[i].score,
          place: i + 1,
        });
      }
    });

  return leaderboard;
}

function GetLeaderboardRowNumber(UDID) {
  db.find({})
    .sort({ score: 1 })
    .exec(function (err, docs) {
      for (var i = 0; i < docs.count; i++) {
        if (docs[i].udid == UDID) return i + 1;
      }
    });

  return 0;
}

module.exports = router;
