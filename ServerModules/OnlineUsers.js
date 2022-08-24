const _ = require("lodash");
const Datastore = require("nedb"),
  db = new Datastore({ filename: "./database/onlineusers.db", autoload: true });


function SetOnline(udid) {
    if(db.findOne({ udid: udid })) return;
    db.insert({ udid: udid, date: new Date() });
}

function SetOffline(udid) {
    db.remove({ udid: udid }, {}, function (err, numRemoved) {}); 
}

function UpdateOnline() {
    db.find({}, function (err, items) {
        for(var i = 0; i < items.length; i++) {
            if(item.date < new Date().getTime() - 1000 * 60 * 5) {
                SetOffline(item.udid);
            }
        }
    });
}

function IsOnline(udid) {
    db.findOne({ udid: udid }, function (err, item) {
        if(item) {
            return true;
        } else {
            return false;
        }
    });
}

setInterval(UpdateOnline, 1000);

module.exports = {
    SetOnline: SetOnline,
    SetOffline: SetOffline,
    IsOnline: IsOnline
}