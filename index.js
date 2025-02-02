const express = require("express");
const app = express();
const mongoose = require('mongoose');
const { UUID } = require('bson');
let restaurants = require("./Schemas/Restaurant");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = "mongodb+srv://admin:pass@comp3123cluster.arhm6.mongodb.net/restaurants?retryWrites=true&w=majority&appName=Comp3123Cluster";
mongoose.connect(uri,{
    pkFactory: { createPk: () =>  new UUID().toBinary() }
})

// Rest API To get all Resturants 
app.get("/restaurants",async (req,res) => {
    try {
        const restaurant = await restaurants.find();
        res.status(200).send(restaurant);
    } catch (error) {
        console.log("ERROR: " + error);
        res.status(500).send(error);        
    }
})

// Rest API To get all Resturants by Type 
app.get("/restaurants/cuisine/:type",async (req,res) => {
    const filter = {
        cuisine : req.params.type,
    }
    try {
        const restaurant = await restaurants.find(filter);
        res.status(200).send(restaurant);
    } catch (error) {
        console.log("ERROR: " + error);
        res.status(500).send(error);        
    }
})


// Rest API To get all Returant _id, cuisines, name, city, resturant_id and Sort it by restaurant_id  
app.get("/restaurant", async (req, res) => {
    const sortBy = req.query.sortBy;
    let restaurant;
    try {
        if (sortBy === "ASC") {
            restaurant = await restaurants.find().select("_id cuisine name city restaurant_id").sort({ restaurant_id: 'asc' });
        } else if (sortBy === "DESC") {
            restaurant = await restaurants.find().select("_id cuisine name city restaurant_id").sort({ restaurant_id: 'desc' });
        } else {
            throw new Error("Impossible Sort Use ASC or DESC")
        }
        res.status(200).send(restaurant);
    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).send({ error: error.message });
    }
});

// Rest API To get all Returant with Delicatessen cuisines That Arnt in Brooklyn Sorted by the name 
app.get("/restaurants/Delicatessen",async (req,res) => {
    try {
        const restaurant = await restaurants
        .find({cuisine: "Delicatessen", city: {$ne: "Brooklyn"}}).select("cuisine name city").sort({ name: 'asc' });
        res.status(200).send(restaurant);
    } catch (error) {
        console.log("ERROR: " + error);
        res.status(500).send(error);        
    }
})

app.listen(port, () => {
    console.log("Listening at: http://localhost:3000/")
})