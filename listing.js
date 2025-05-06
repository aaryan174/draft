const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
      url: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2023/01/11/architecture-building-7765288_960_720.jpg", // ✅ Direct image link
        set: (v) => v === "" ? "https://cdn.pixabay.com/photo/2023/01/11/architecture-building-7765288_960_720.jpg" : v,
      },
        filename: String, 
      },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
