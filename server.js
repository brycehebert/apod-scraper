const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const fetch = require("node-fetch");

app.use(cors({ methods: "POST" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "./client/build/index.html"));
});

app.post("/apod", (req, res) => {
  const { url } = req.body;
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      res.send(data);
    });
});

app.all("*", (req, res) => {
  res.status(404).send("Nothing Here for You.");
});

//Listener
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
