const express = require("express");
const URLModel = require("./models/URLModel");
const connection = require("./database/db");
const cors = require("cors");
const { v4: uuid } = require("uuid");


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin:"*",
}));

app.get("/", (req, res) => {
  res.send("URL Shortner Backend");
});

app.post("/", async (req, res) => {
  const { url, custom } = req.body;
  let generated;
  const getShort = await URLModel.findOne({ url });
  if (!getShort) {
    if (!custom) generated = `https://urljoy.herokuapp.com/${uuid()}`;
    else generated = `https://urljoy.herokuapp.com/${custom}`;

    const saveShort = await URLModel({ url: url, short: generated });
    saveShort.save((err) => {
      if (err) console.log(err);
    });
  } else generated = getShort.short;
  return res.send(generated);
});

app.get("/:search", async (req, res) => {
  const { search } = req.params;
  let shortUrl = `https://urljoy.herokuapp.com/${search}`;
  const getURL = await URLModel.findOne({ short: shortUrl });
  if (getURL && req.query.q == 'search') return res.send(getURL.url);
  else if(getURL) return res.redirect(getURL.url);
  else
    return res
      .status(404)
      .send("URL not found, might have expired. Please, generate a new One!");
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, async() => {
  console.log(`Server running at ${PORT}`);
  try{
    await connection;
    console.log("Connected to DB");
  }catch(err){
    console.log("Something went wrong!");
  }
});
