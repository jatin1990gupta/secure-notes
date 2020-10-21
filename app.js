const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/note");
const logger = require("morgan");

const User = require("./models/user");

require("dotenv").config();

const initiateMongoServer = async () => {
  await mongoose.connect(process.env.MONGO_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("connected to DB");
};

const port = process.env.PORT || 3000;

const store = new MongoDBStore({
  uri: process.env.MONGO_KEY,
  collection: "sessions",
});

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  try {
    const user = await User.findById(req.session.user._id);
    req.user = user;
    next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

app.use(indexRoutes);
app.use("/auth", authRoutes);
app.use("/note", noteRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("500");
});

initiateMongoServer();

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
