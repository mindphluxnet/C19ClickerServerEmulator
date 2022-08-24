const express = require("express");
const router = express.Router();
const db = require("./Database");

router.post("/GetCards", (req, res) => {
  console.log("/UserDevCards/GetCards");
  var UUID = req.body.UUID;

  db.findOne(
    { udid: UUID, cards: { developmentCardType: { $exists: true } } },
    function (err, item) {
      res.send(item);
    }
  );
});

router.post("/AddDevcard", (req, res) => {
  console.log("/UserDevCards/AddDevcard");
  var UDID = req.body.UDID;
  var devCardId = req.body.devCardId;
  var count = req.body.count;

  db.findOne({ udid: UDID }, function (err, item) {
    var _cards = item.cards;

    var _card = _cards.find((x) => x.developmentCardType == devCardId);

    if (_card) {
      _card.count += count;
    } else {
      _cards.push({
        developmentCardType: devCardId,
        count: count,
      });
    }
    db.update(
      { udid: UDID },
      { $set: { cards: _cards } },
      {},
      function (err, numReplaced) {
        res.send({ success: true });
      }
    );
  });
});

router.post("/UpgradeCard", (req, res) => {
  console.log("/UserDevCards/UpgradeCard");
  var UDID = req.body.UDID;
  var devCardId = req.body.devCardId;

  db.findOne({ udid: UDID }, function (err, item) {
    var _cards = item.cards;

    var _card = _cards.find((x) => x.developmentCardType == devCardId);

    if (_card) {
      _card.level ++;
    } else {
      res.send({ success: false });
    }
    db.update(
      { udid: UDID },
      { $set: { cards: _cards } },
      {},
      function (err, numReplaced) {
        res.send({ success: true });
      }
    );
  });
});

module.exports = router;
