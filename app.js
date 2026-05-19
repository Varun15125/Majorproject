const express = require("express");
const app =express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js")
const path = require("path");
const ExpressError= require("./utils/ExpressError.js")
const {listingSchema}= require("./schema.js")
const Review= require("./models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>
    {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Hi I am root ");
});

const validateListing = (req,res,next)=>{
      let {error} = listingSchema.validate(req.body);
   if(error){
    let errMsg =error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
   }else{
    next();
   }

}


//index route
app.get("/listings",async (req,res)=>{
   const allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings});
});

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");   
});

//show route
app.get("/listings/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    id=id.trim();
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));

//Create Route
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings"); 
        
})

);

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update Route

app.put("/listings/:id", validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{returnDocument:"after"});
    // const listing = await Listing.findByIdAndUpdate(id,{title: req.body.Listing.title,description:req.body.Listing.description,price:req.body.listing.price,location:req.body.listing.location,country:req.body.listing.country,},{returnDocument:"after"});

    res.redirect(`/listings/${listing._id}`);
}));

//Delete Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("deleted listing is ",deletedListing);
    res.redirect("/listings");
}));

// Reviews
//post route
app.post("/listings/:id/reviews",async(req,res)=>{
   let listing= await Listing.findById(req.params.id);
   let newReview = new Review(req.body.Review);

   listing.review.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.send("new review saved");
})

// app.get("/testListing", async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"my New Villa",
//         description:"by the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",   
//     });

//    await sampleListing.save();
//    console.log ("sample was saved");
//    res.send("successfull testing");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>{
    let{ statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8080,(req ,res)=>{
    console.log("server is running on port 8080");
});
