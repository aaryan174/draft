const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require('./models/listing');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const WrapAsync = require("./utils/WrapAsync");
const ExpressError = require("./utils/ExpressError");
const { error } = require("console");


const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() => {
    console.log("connected to DataBase");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
};

app.set("view engine", "ejs");
app.set ("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.send('Hello World');
});
//index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
});

//new route
    app.get("/listings/new", async(req, res) => {
        res.render("listings/new");
    });

//show route
app.get("/listings/:id", async(req, res) => {
    let {id} = req.params;
     const listing = await Listing.findById(id);
     res.render("listings/show", { listing });
});
//create route
app.post("/listings", 
    WrapAsync (async(req, res, next) => {
    
        let newLsitng = new Listing(req.body.listing);
        await newLsitng.save();
        res.redirect("/listings");
    })
);

//Edit route
app.get("/listings/:id/edit", async(req, res) => {
    let {id} = req.params;
     const listing = await Listing.findById(id);
    res.render("listings/edit", {listing});
});
//update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});
//Delete Route
app.delete("/listings/:id", async(req, res) => {
    let { id } = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

// app.get("/testLisitng", async(req, res) => {
//     let sampleLisitng = new Listing({
//         title: "my villa",
//         descriptiion: "by the beach",
//         price: 233334,
//         location: "randi chowk",
//         country: "pakistan MKC",
//     });
//     await sampleLisitng.save();
//     console.log("successful");
//     res.send("sucessfull testing");
// });
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"))
});
// middleware
app.use((err, req, res, next) => {
    let {statusCode, Message} = error
    res.send("something went wrong!!")
    res.status(statusCode).send(Message);
});


app.listen(8080, () => {
    console.log("server is running");
});
