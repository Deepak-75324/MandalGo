const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
// connect to mongo db
main()
.then((res) => {
    console.log("connect to DB");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

app.get('/', (req,res) => {
    res.send("Hi i am coder..")
});

// index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listing/index.ejs', { allListings, title: "Explore Listings | MandalGo" });
});

//new and create route
app.get("/listings/new", (req,res) => {
    res.render("listing/new.ejs", { title: "Add Listing | MandalGo" });
});

//create route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);

    await newListing.save();

    res.redirect("/listings");
});

// edit route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", {listing, title: "Edit Listing | MandalGo"});
});
// update route
app.put("/listings/:id", async (req, res) => {

    const { id } = req.params;

    const listingData = req.body.listing;

    // Determine the submitted image value.
    // The form submits image as an object: listing[image][url] (+ filename).
    const submittedImage = listingData.image;
    const submittedUrl =
        submittedImage && typeof submittedImage === "object"
            ? submittedImage.url
            : submittedImage;

    // If the user did not provide a new image (empty or missing),
    // keep the previously saved image.
    if (!submittedUrl || submittedUrl.trim() === "") {
        const existing = await Listing.findById(id);
        if (existing) {
            listingData.image = existing.image;
        }
    }

    await Listing.findByIdAndUpdate(
        id,
        listingData,
        {
            new: true,
            runValidators: true
        }
    );

    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});
// show route
app.get("/listings/:id", async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    res.render("listing/show.ejs", { listing, title: "Listing Details | MandalGo" });
});


// // all listening route
// app.get('/testListing', async(req,res) => {
//     let sampleListing = new Listing({
//         title: "Janaki temple",
//         description: "Birth place of raja Janak and lord mata Sita",
//         price: 10,
//         location: "Janakpur",
//         country: "Nepal",
//         category: "Tourist place",
//         rating: 4.5,
//     });

//     await sampleListing.save()
//     .then(res => {console.log("Data was saved!");
//     })
//     .catch(err => console.log(err));
//     res.send("All Listing..");
// });
app.listen(8080,'0.0.0.0', () => {
    console.log("app is listening on port 8080");
});
