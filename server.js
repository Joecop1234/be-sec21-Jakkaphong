const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 3100;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());

app.use('/course',require('./controllers/course'));




app.listen(port,  () => {
    console.log(`API running at port${port}`);
});
