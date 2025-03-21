const express = require("express");
const app = express();

const PORT = process.env.PORT | 5050 ;


//Database Connection Import
const connectDB = require("./config/db")
connectDB();


app.get("/", (req, res) => {
    res.send({
        "message" : "Test Routes"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
