const express = require('express'); 
const app = express();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var server = require("./server");

app.use("/covid", server);

app.use(function(req, res) {
    console.log("Not found: " + req.url);
    console.log(req.body);
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});