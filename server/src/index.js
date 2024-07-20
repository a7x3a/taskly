const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const authRoute = require("./routes/auth");
const notesRouter = require("./routes/notes");
const userRouter = require("./routes/user");
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();

//intilize the databse
require("./database");

//using the parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://tasklly.vercel.app",
    credentials: true,
  })
);
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://a7x3a:ahmad123@mongodb.dyxueco.mongodb.net/todo_list?retryWrites=true&w=majority&appName=mongodb",
      collectionName: "sessions",
    }),
    secret: "AABBCCDDEE",
    resave: false,
    httpOnly: true,
    saveUninitialized: false,
    cookie: { secure: true , maxAge : 21600000 /*6h*/ },
  })
);

//Creating Auth Routes
app.use("/auth", authRoute);
app.use((request, response, next) => {
  if (request.session.user) {
    next();
  } else {
    console.log("Cannot Access to Private Routes!");
    response.sendStatus(401);
  }
});

//intialize routes after auth
app.use("/notes", notesRouter);
app.use("/user", userRouter);

//intialize the server
const PORT = process.env.PORT || 8080;
app.listen(8080, () => {
  console.log(`Started Server on Port ${PORT}`);
});
