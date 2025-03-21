const express = require("express");
const app = express();

const PORT = process.env.PORT | 5050;

//Import Routes
const applicationRoutes = require("./routes/applicationRoutes");

//Database Connection Import
const connectDB = require("./config/db");
connectDB();

app.get("/", (req, res) => {
  res.send({
    message: "Test Routes",
  });
});

app.use("/api/cred/application", applicationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
