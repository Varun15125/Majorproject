const express =require("express");
const router =express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("../schema.js");
const Listing = require("../models/listing");


const validateListing = (req,res,next)=>{
      let {error} = listingSchema.validate(req.body);
   if(error){
    let errMsg =error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
   }else{
    next();
   }

};
//index route
router.get("/",async (req,res)=>{
   const allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings});
});

//New Route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");   
});

//show route
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    id=id.trim();
    const listing = await Listing.findById(id).populate("review");
    res.render("listings/show.ejs",{listing});
}));

//Create Route
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings"); 
        
})

);

//Edit Route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update Route

router.put("/:id", validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{returnDocument:"after"});
    // const listing = await Listing.findByIdAndUpdate(id,{title: req.body.Listing.title,description:req.body.Listing.description,price:req.body.listing.price,location:req.body.listing.location,country:req.body.listing.country,},{returnDocument:"after"});

    res.redirect(`/listings/${listing._id}`);
}));

//Delete Route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("deleted listing is ",deletedListing);
    res.redirect("/listings");
}));


module.exports =router;
