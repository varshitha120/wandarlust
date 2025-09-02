if(process.env.NODE_ENV!="production"){
   require('dotenv').config();

}

const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const ejsmate = require('ejs-mate');
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User=require("./models/user.js");

app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"/public")));
const methodOverride = require('method-override');
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose");
 const dbUrl=process.env.ATLASDB_URL
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

async function main() {
    mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("connected succesfully");
}).catch(err=>console.log(err));

// app.get("/",(req,res)=>{
//    res.send("sending");

// });
 const store=MongoStore.create({
   mongoUrl:dbUrl,
   crypto:{
      secret:process.env.secret,
   },
   touchAfter:24*3600,
 }); 
 store.on("error",(err)=>{
   console.log("error in mongo session store",err);
 });

const sessionOptions={
   store:store,
   secret:process.env.secret,
   resave:false,
   saveUninitialized:true,
   cookie:{
      expires:Date.now()+7*24*60*60*1000,
      maxAge:7*24*60*60*1000,
      httpOnly:true,}

}



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
   res.locals.success=req.flash('success');
   res.locals.error=req.flash('error');
   res.locals.currUser=req.user;
   next();
});





 app.use("/listings",listingRouter);
 app.use("/listings/:id/reviews",reviewRouter);
 app.use("/",userRouter);

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not found"));
// });
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
//   res.status(statusCode).send(message);
// res.send("something went wrong")
res.status(statusCode).render("error.ejs",{message});
});

// routes/debug.js (or inside your listings router)
// app.get("/debug/listings/all", async (req, res) => {
//   try {
//     const listings = await Review.find({});
//     res.send(listings);
//   } catch (err) {
//     res.status(500).send("Error fetching listings");
//   }
// });
// app.get("/debug/delete/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Review.findByIdAndDelete(id);
//     res.send(`Deleted listing with ID: ${id}`);
//   } catch (err) {
//     res.status(500).send("Error deleting listing");
//   }
// });


app.listen(port,()=>{
console.log("app is listening");
});



