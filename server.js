const express = require("express");
const router = express.Router();

const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");

const Category = require("./Enums/Category");
const UpgradeType = require("./Enums/UpgradeType");
const RawMaterial = require("./Enums/RawMaterial");

const db = require("./ServerModules/Database");

var AppConfig = require("./ServerModules/AppConfig");
router.use("/AppConfig", AppConfig);

var SetPlayerData = require("./ServerModules/SetPlayerData");
router.use("/SetPlayerData", SetPlayerData);

var UserDevCards = require("./ServerModules/UserDevCards");
router.use("/UserDevCards", UserDevCards);

var GetLeaderboard = require("./ServerModules/GetLeaderboard");
router.use("/GetLeaderboard", GetLeaderboard);


const OnlineUsers = require("./ServerModules/OnlineUsers");

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
          tasks: [],
          categories: [
            { categoryId: Category.Security, isUnlocked: true, minRank: 0, price: 0 },
            { categoryId: Category.Currency, isUnlocked: true, minRank: 0, price: 0 },
            {
              categoryId: Category.HealthService,
              isUnlocked: false,
              minRank: 1,
              price: 10000,
            },
            { categoryId: Category.None, isUnlocked: false, minRank: 0 },
            {
              categoryId: Category.Politics,
              isUnlocked: false,
              minRank: 5,
              price: 50000,
            },
            {
              categoryId: Category.Production,
              isUnlocked: false,
              minRank: 50,
              price: 500000,
            },
            {
              categoryId: Category.Quarantine,
              isUnlocked: false,
              minRank: 25,
              price: 100000,
            },
            {
              categoryId: Category.Research,
              isUnlocked: false,
              minRank: 10,
              price: 1000000,
            },
          ],
          userName: "User_" + _.random(10000, 99999, false),
        },
        function (err, result) {
          db.findOne({ udid: UDID }, function (err, item) {
            item.isNewUser = true;
            item["resistanceToVirus"] = item["RawMaterialCount_ResistanceToVirus"];
            res.send(item);

            OnlineUsers.SetOnline(UDID);
          });
        }
      );
    } else {
      console.log("Found existing account");
      item[0]["resistanceToVirus"] = item[0]["RawMaterialCount_ResistanceToVirus"];
      res.send(item[0]);

      OnlineUsers.SetOnline(UDID);
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
  
    OnlineUsers.SetOnline(UDID);
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
  
    OnlineUsers.SetOnline(UDID);
  });

module.exports = router;

router.post("/GetAvailableCards", (req, res) => {
  console.log("/GetAvailableCards");
  var UDID = req.body.UDID;

  db.findOne({ udid: UDID }, function (err, item) {
    res.send(item.cards);
  });

  OnlineUsers.SetOnline(UDID);
});

router.post("/GetRandomTasks", (req, res) => {
  console.log("/GetRandomTasks");
  var UDID = req.body.UDID;
  var taskCount = parseInt(req.body.taskCount);

  // taskTypeIds:
  // 1 - Buy
  // 2 - Get
  // 3 - Upgrade
  // 4 - Spend

  var tasks = [];
  for (i = 0; i < taskCount; i++) {
    var taskTypeId = _.random(1, 4, false);

    var categoryId = _.sample(GetUnlockedCategories(UDID));

    var task = {
      taskTypeId: taskTypeId,
      rawMaterialId: RawMaterial.RawMaterialGroups[categoryId][_.random(0, RawMaterial.RawMaterialGroups[categoryId].length - 1, false)],
      randomValue: _.random(1, 10, false),
      isCompleted: false,
    };
    tasks.push(task);
  }

  db.update({ udid: UDID} , { $set: { tasks: tasks } }, {}, function (err, numReplaced) {});
  res.send(tasks);

  OnlineUsers.SetOnline(UDID);
});

function GetUnlockedCategories(udid) {
  var categories = [];
  db.findOne({ udid: udid }, function (err, item) {
    for (i = 0; i < item.categories.length; i++) {
      if (item.categories[i].isUnlocked) {
        categories.push(item.categories[i].categoryId);
      }
    }
  }).then(() => {
    return categories;
  });
}

router.post("/UpdateTask", (req, res) => {
  console.log("/UpdateTask");
  var UDID = req.body.UDID;
  var taskTypeId = req.body.taskTypeId;
  var rawMaterialId = req.body.rawMaterialId;
  var randomValue = req.body.value;

  db.findOne({ udid: UDID }, function (err, item) {
    var _tasks = item.tasks;
    for (i = 0; i < _tasks.length; i++) {
      if(_tasks[i].taskTypeId == taskTypeId && _tasks[i].rawMaterialId == rawMaterialId && _tasks[i].randomValue == randomValue) 
      {
        _tasks[i].isCompleted = true;
        break;
      };
    };

    db.update(
      { udid: UDID },
      { $set: { tasks: _tasks } },
      {},
      function (err, numReplaced) {
        if (numReplaced != 0) {
          res.send({ isSuccess: true });
        } else {
          res.send({ isSuccess: false });
        }
      });
    });

    OnlineUsers.SetOnline(UDID);
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
