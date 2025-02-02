const mongoose = require('mongoose');

const addressSchema = mongoose.Schema(
    {
        'building' : String, 
        'street': String, 
        'zipcode': String
    }
)


const RestaurantsSchema = mongoose.Schema(
    {
        "address": addressSchema,
        "city": String,
        "cuisine": String,
        "name": String,
        "restaurant_id": String,
       }       
)


const Restaurants = mongoose.model("Restaurants",RestaurantsSchema);
module.exports = Restaurants;