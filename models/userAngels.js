const mongoose = require("mongoose");

// Define the schema for storing user locations
const userAngelsSchema = new mongoose.Schema({
    // The userId field is used to associate each location with a specific user.
    // It references the ObjectId from the User model, ensuring a link between the user's profile and their angels.
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, // Specifies the type as ObjectId
        ref: 'User', // References the User model
        required: [true,"Please provide a user"], // This field is required to ensure each location is linked to a user
    },
    // The displayName field allows users to assign a name to each location, like "Home" or "Work".
    displayName: {
        type: String, // Specifies the type as String
        required:[true,"Please provide a display name"],
        maxlength: 100, // Limits the length of the display name to 100 characters
    },
    // The address field stores the full address of the location as a string.
   
    contactNumber:{
        type: String,
        required:[true,"Please provide a contact number"],
        match:[/^\d{10}$/, "Please provide a valid contact number"],
        
    },
});

// Export the UserLocation model based on the schema
module.exports = mongoose.model("UserAngel", userAngelsSchema);
