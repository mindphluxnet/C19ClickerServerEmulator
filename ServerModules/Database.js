const Datastore = require("nedb"),
  db = new Datastore({ filename: "./database/data.db", autoload: true });

  module.exports = db;