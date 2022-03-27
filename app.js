require("dotenv").config()

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./db/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "brehhrjstkykystyktytk"
const ejs = require("ejs");

mongoose.connect(process.env.DB_CONNECT, (err) => {
  if (err) throw err;
  else console.log("connected")
})

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.get("/", (req,res) => {
  res.render("signup")
})

app.post("/signup", async(req,res) => {
  const {username, email, password: plain} = req.body;

  const password = await bcrypt.hash(plain, 10, (err, data) => {

  })
  console.log(password)
  try{
    const newUser = await User.create({
      username,
      password,
      email
    }, (err, data) => {
      if (err) throw err;
      else res.status(200).render("prof", {data: data})
    })
   console.log("a user created: " , newUser)
  }catch(err) {
    if (err.code === 11000){
      return res.json({status: "err", err: "a user name already existes"})
  }
  throw err;
}
})

app.get("/prof/:username", (req,res) => {
  const username = req.params.username
  const usernames = User.findOne({username})
  res.render('prof')
})

app.get("/login", (req,res) => {
  res.render("login")
})

app.post("/login", async (req,res) => {
  const {username, password} = req.body

  const user = await User.findOne({username}).lean()

  if (!user) {
    res.json({status: "err", err: "invalid"})
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({
      id: user._id,
      username: user.username
    },JWT_SECRET
  )
  return res.json({status: "ok", data: token})}

   res.json({status: "ok"})

})

app.listen(3000, () => {
  console.log("works...")
});
