const express = require("express");
const app = express();
const cors = require("cors");
const fetch = require("node-fetch");

app.use(cors());
app.use(express.json());

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
