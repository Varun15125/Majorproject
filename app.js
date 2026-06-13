
if (process.env.NODE_ENV != "production") { 
    require('dotenv').config(); 
} 

const express = require("express"); 
const app = express(); 
const mongoose = require("mongoose"); 
const methodOverride = require("method-override"); 
const ejsMate = require("ejs-mate"); 
const path = require("path"); 
const ExpressError = require("./utils/ExpressError.js"); 
const session = require("express-session"); 

//  Correct import for modern connect-mongo (Do NOT pass session here)
const MongoStore = require('connect-mongo').default; 

const flash = require("connect-flash"); 
const passport = require("passport"); 
const LocalStrategy = require("passport-local"); 
const User = require("./models/user.js"); 

const listingRouter = require("./routes/listing.js"); 
const reviewRouter = require("./routes/review.js"); 
const userRouter = require("./routes/user.js"); 

const dbUrl = process.env.ATLASDB_URL; 

main() 
    .then(() => { 
        console.log("connected to DB"); 
    }) 
    .catch((err) => { 
        console.log("DB Connection Error:", err); 
    }); 

async function main() { 
    await mongoose.connect(dbUrl); 
} 

//  Application Configurations
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "/views")); 
app.engine("ejs", ejsMate); 

//  Fundamental Request Parsers & Static Assets
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride("_method")); 
app.use(express.static(path.join(__dirname, "/public"))); 

//  Correct initialization for modern connect-mongo
const store = MongoStore.create({ 
    mongoUrl: dbUrl, 
    crypto: { 
        secret: process.env.SECRET,
    }, 
    touchAfter: 24 * 3600, 
}); 

store.on("error", (err) => { 
    console.log("error in mongo session store", err); 
}); 

const sessionOptions = { 
    store: store, 
    secret: process.env.SECRET, 
    resave: false, 
    saveUninitialized: true, 
    cookie: { 
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, 
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: true
    } 
};

//  Critical Middleware Order 
app.use(session(sessionOptions)); 
app.use(flash()); 

app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

//  Global View Variables
app.use((req, res, next) => { 
    res.locals.success = req.flash("success"); 
    res.locals.error = req.flash("error"); 
    res.locals.currUser = req.user; 
    next(); 
}); 

// Routes
app.get("/", (req, res) => { 
    res.redirect("/listings"); 
}); 

app.use("/listings", listingRouter); 
app.use("/listings/:id/reviews", reviewRouter); 
app.use("/", userRouter); 

//  Error Handling Middleware
app.use((req, res, next) => { 
    next(new ExpressError(404, "page not found")); 
}); 

app.use((err, req, res, next) => { 
    let { statusCode = 500, message = "Something went wrong" } = err; 
    res.status(statusCode).render("error.ejs", { message }); 
}); 

app.listen(8080, () => { 
    console.log("server is running on port 8080"); 
});
