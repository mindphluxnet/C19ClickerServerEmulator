const express = require("express");
const router = express.Router();
const Datastore = require("nedb"),
  db = new Datastore({ filename: "./database/data.db", autoload: true });
const { v4: uuidv4 } = require("uuid");

require("./constants.js");

var AppConfig = require("./AppConfig");
router.use("/AppConfig", AppConfig);

var SetPlayerData = require("./SetPlayerData");
router.use("/SetPlayerData", SetPlayerData);

var UserDevCards = require("./UserDevCards");
router.use("/UserDevCards", UserDevCards);

var GetLeaderboard = require("./GetLeaderboard");
router.use("/GetLeaderboard", GetLeaderboard);

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

module.exports = router;
