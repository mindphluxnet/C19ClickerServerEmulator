const express = require("express");
const router = express.Router();
const Datastore = require("nedb"),
  db = new Datastore({ filename: "./database/data.db", autoload: true });
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");

const SECURITY = 2;
const CURRENCY = 1;
const HEALTHSERVICE = 3;
const NONE = 0;
const POLITICS = 4;
const PRODUCTION = 7;
const QUARANTINE = 6;
const RESEARCH = 5;

router.post("/AppConfig/CompareAppVersion", (req, res) => {
  console.log("/AppConfig/CompareAppVersion");
  res.send({ isSuccess: true });
});

router.post("/GetPlayerData", (req, res) => {
  console.log("/GetPlayerData");
  var UDID = req.body.UDID;
  db.find({ udid: UDID }, function (err, item) {
    if (item.length == 0) {
      var _accountId = uuidv4();

      console.log("Creating new account: " + _accountId);

      db.insert(
        {
          udid: UDID,
          isNewUser: false,
          rank: 0,
          accountId: _accountId,
          userBlocked: false,
          banDescription: "",
          evolutionPoints: 0,
          RawMaterialCount_ResistanceToVirus: 0,
          ranking: 0,
          score: 0.0,
          ep: 0,
          cards: [],
          categories: [
            { categoryId: SECURITY, isUnlocked: true, minRank: 0, price: 0 },
            { categoryId: CURRENCY, isUnlocked: true, minRank: 0, price: 0 },
            {
              categoryId: HEALTHSERVICE,
              isUnlocked: false,
              minRank: 1,
              price: 10000,
            },
            { categoryId: NONE, isUnlocked: false, minRank: 0 },
            {
              categoryId: POLITICS,
              isUnlocked: false,
              minRank: 5,
              price: 50000,
            },
            {
              categoryId: PRODUCTION,
              isUnlocked: false,
              minRank: 50,
              price: 500000,
            },
            {
              categoryId: QUARANTINE,
              isUnlocked: false,
              minRank: 25,
              price: 100000,
            },
            {
              categoryId: RESEARCH,
              isUnlocked: false,
              minRank: 10,
              price: 1000000,
            },
          ],
          userName: "New User " + _accountId,
        },
        function (err, result) {
          db.findOne({ udid: UDID }, function (err, item) {
            item.isNewUser = true;
            res.send(item);
          });
        }
      );
    } else {
      console.log("Found existing account");
      res.send(item[0]);
    }
  });
});

router.post("/SetPlayerData/ChangeName", (req, res) => {
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

router.post("/GetCategoryDetails", (req, res) => {
  console.log("/GetCategoryDetails");
  var UDID = req.body.UDID;
  var categoryId = req.body.categoryId;

  db.findOne({ udid: UDID }, function (err, item) {
    for (i = 0; i < item.categories.length; i++) {
      if (item.categories[i].categoryId == categoryId) {
        var response = {
          isUnlocked: item.categories[i].isUnlocked,
          categoryId: item.categories[i].categoryId,
          category: {
            price: item.categories[i].price,
            minRank: item.categories[i].minRank,
          },
        };

        res.send(response);
        return;
      }
    }
  });
});

router.post("/UnlockCategory", (req, res) => {
  console.log("/UnlockCategory");
  var UDID = req.body.UDID;
  var categoryId = req.body.categoryId;

  db.findOne({ udid: UDID }, function (err, item) {
    var _categories = item.categories;
    for (i = 0; i < _categories.length; i++) {
      if (_categories[i].categoryId == categoryId) {
        _categories[i].isUnlocked = true;
        break;
      }
    }
    db.update(
      { udid: UDID },
      { $set: { categories: _categories } },
      {},
      function (err, numReplaced) {
        if (numReplaced != 0) {
          res.send({ isSuccess: true });
        } else {
          res.send({ isSuccess: false });
        }
      }
    );
  });
});

router.post("/GetAvailableCards", (req, res) => {
  console.log("/GetAvailableCards");
  var UDID = req.body.UDID;

  db.find({ udid: UDID }, function (err, item) {
    res.send(item.cards);
  });
});

router.post("/UserDevCards/GetCards", (req, res) => {
  console.log("/UserDevCards/GetCards");
  var UUID = req.body.UUID;

  db.find(
    { udid: UUID, cards: { developmentCardType: { $exists: true } } },
    function (err, item) {
      res.send(item);
    }
  );
});

router.post("/GetRandomTasks", (req, res) => {
  console.log("/GetRandomTasks");
  var UDID = req.body.UDID;
  var taskCount = req.body.taskCount;

  var task = { taskTypeId: 1, rawMaterialId: 1, randomValue: 1 };
  res.send(task);
});

router.post("/GetTime", (req, res) => {
  console.log("/GetTime");
  var today = new Date();

  var month = today.getMonth();
  if (month < 10) month = "0" + month;

  var day = today.getDate();
  if (day < 10) day = "0" + day;

  var hour = today.getHours();
  if (hour < 10) hour = "0" + hour;

  var minute = today.getMinutes();
  if (minute < 10) minute = "0" + minute;

  var second = today.getSeconds();
  if (second < 10) second = "0" + second;

  var roundTripTime =
    today.getFullYear() +
    "-" +
    month +
    "-" +
    day +
    "T" +
    hour +
    ":" +
    minute +
    ":" +
    second +
    "." +
    today.getMilliseconds() +
    "+00:00";
  res.send(roundTripTime);
});

router.post("/SetPlayerData/SetRTV", (req, res) => {
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

router.post("/SetPlayerData/SetEP", (req, res) => {
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

router.post("/SetPlayerData/AddScore", (req, res) => {
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

router.post("/SetPlayerData/AdvanceRank", (req, res) => {
  console.log(req.body);
  var UDID = req.body.UDID;
});

router.post("/GetLeaderboard", (req, res) => {
  console.log("/GetLeaderboard");
  var count = req.body.count;
  var offset = req.body.offset;
  var leaderboard = GenerateLeaderboard(count, offset);
  res.send(leaderboard);
});

router.post("/GetLeaderboard/GetUserRowNumber", (req, res) => {
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
