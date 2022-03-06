const express = require("express");
const router = express.Router();
const Datastore = require("nedb"),
  db = new Datastore({ filename: "./database/data.db", autoload: true });

router.post("/GetCards", (req, res) => {
  console.log("/UserDevCards/GetCards");
  var UUID = req.body.UUID;

  db.find(
    { udid: UUID, cards: { developmentCardType: { $exists: true } } },
    function (err, item) {
      res.send(item);
    }
  );
});

module.exports = router;
