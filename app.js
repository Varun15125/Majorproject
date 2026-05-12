const express = require("express");
const app =express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js")
const path = require("path");

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
app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    id=id.trim();
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//Create Route
app.post("/listings",wrapAsync(async(req,res,next)=>{
const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings"); 
        
})

);

//Edit Route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//Update Route

app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{returnDocument:"after"});
    // const listing = await Listing.findByIdAndUpdate(id,{title: req.body.Listing.title,description:req.body.Listing.description,price:req.body.listing.price,location:req.body.listing.location,country:req.body.listing.country,},{returnDocument:"after"});

    res.redirect(`/listings/${listing._id}`);
});

//Delete Route
app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("deleted listing is ",deletedListing);
    res.redirect("/listings");
});

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

app.use((err,req,res,next)=>{
    res.send("something went wrong!")

})

app.listen(8080,(req ,res)=>{
    console.log("server is running on port 8080");
});
