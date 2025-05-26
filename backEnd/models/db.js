const mongoose = require("mongoose");
require("dotenv").config();
const DB_URL = process.env.Mongodb_Url;

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("mongodb is connected successfully");
}).catch((err) => {
    console.log("Mongodb connection error", err);
});