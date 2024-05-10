const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000;

// Endpoint to search nearby locations

app.get("/search", async (req, res) => {
  const { name, latitude, longitude } = req.query;

  try {
    let apiUrl = "";
    if (name) {
      apiUrl = `https://nominatim.openstreetmap.org/search?q=${name}&format=json`;
    } else if (latitude && longitude) {
      apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    } else {
      return res.status(400).json({
        error:
          "Missing query params: name or latitude & longitude are required.",
      });
    }

    // Making a request to OpenStreetMap API
    const response = await axios.get(apiUrl);
    const nearbyLocations = response.data;

    // console.log(response)

    res.json({ nearbyLocations });
  } catch (error) {
    console.error("Error fetching nearby locations:", error);
    res.status(500).json({ error: "Error while fetching nearby locations." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
