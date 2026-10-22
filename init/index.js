if(process.env.NODE_ENV !== "production") {
    require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
}

const mongoose = require('mongoose');
const Listing = require('../models/listings');
const User = require('../models/user');
const initData = require('./data');

const dbUrl = process.env.ATLAS_DB;

main().then(()=>console.log("Connected to Database")).catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
};

const initDB = async ()=>{
    try {
        // Delete existing data
        await Listing.deleteMany({});
        await User.deleteMany({});
        console.log("Old data deleted");

        // Create a new user
        const newUser = new User({
            email: "admin@wanderlust.com",
            username: "admin",
            role: "admin"
        });
        const registeredUser = await User.register(newUser, "password123");
        console.log("Admin user created:", registeredUser);

        // Create listings with the user's ID
        initData.data = initData.data.map((obj)=> ({
          ...obj,
          owner: registeredUser._id,
        }));
        await Listing.insertMany(initData.data);
        console.log("New listings with owner added successfully!");
        
        // Close the connection
        await mongoose.connection.close();
        console.log("Database connection closed");
    } catch(err) {
        console.log("Error during initialization:", err);
        await mongoose.connection.close();
    }
}

initDB();