import axios from "axios"; // Import the axios library for making HTTP requests

// Route to fetch nearby places
export const nearByPlacesController = async (req, res) => {
  try {
    const { location, radius } = req.body; // Extract location and radius from the request body
    if (!location || !radius) {
      // Check if location or radius is not provided
      return res
        .status(400) // Return a 400 Bad Request status
        .json({ error: "Please provide location and radius" }); // Send an error message
    }

    if (!location.lat || !location.lng) {
      // Check if location does not include lat or lng
      return res
        .status(400) // Return a 400 Bad Request status
        .json({ error: "Location must include lat and lng" }); // Send an error message
    }

    if (typeof radius !== "number" || radius <= 0) {
      // Check if radius is not a positive number
      return res
        .status(400) // Return a 400 Bad Request status
        .json({ error: "Radius must be a positive number" }); // Send an error message
    }

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      // Check if Google Maps API key is not set
      return res.status(500).json({ error: "Google Maps API key is not set" }); // Return a 500 Internal Server Error status with an error message
    }

    // Call to Google Places API
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`, // Google Places API endpoint
      {
        params: {
          location: `${location.lat},${location.lng}`, // Set the location parameter
          radius: radius, // Set the radius parameter
          key: process.env.GOOGLE_MAPS_API_KEY, // Set the API key parameter
        },
      }
    );

    res.json(response.data.results); // Send the results from the API response as JSON
    console.log(response.data.results); // Log the results to the console
  } catch (error) {
    console.error("Error in nearby places:", error); // Log any errors to the console
    res.status(500).json({ error: "Failed to fetch nearby places" }); // Return a 500 Internal Server Error status with an error message
  }
};
