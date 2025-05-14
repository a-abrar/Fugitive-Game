# Fugitive Hunt: Dark Pursuit - Backend

This is the backend service for the Fugitive Hunt game. It provides the necessary APIs to support the game's functionality.

## Table of Contents
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Running the Backend](#running-the-backend)
- [Game Flow](#game-flow)

## Features

- **Fugitive Location Generation**: Randomly selects a city where the fugitive is hiding and generates a cryptic hint.
- **Capture Status Calculation**: Determines if the fugitive has been captured based on the selected cities and vehicles.

## API Endpoints

### GET `/api/fugitive-location`
- **Description**: Generates a random fugitive location and a cryptic hint.
- **Response**:
  ```json
  {
    "fugitiveLocation": {
      "name": "City Name",
      "distance": 50
    },
    "hint": "A cryptic hint about the fugitive's location."
  }

### POST /api/capture-status
**Description**: Determines if the fugitive has been captured based on the selected cities and vehicles.
**Request Body**:
{
  "copChoices": [
    {
      "vehicle": "EV Bike",
      "city": "City Name"
    },
    ...
  ]
}

**Headers**:
fugitive-location: The fugitive location data.
**Response***:
{
  "success": true,
  "fugitiveLocation": {
    "name": "City Name",
    "distance": 50
  },
  "message": "Fugitive captured in City Name!"
}


### Setup
**Prerequisites**
Node.js
npm
**Installation**
Navigate to the backend directory:


cd path/to/backend
**Install dependencies**:


npm install
Create a .env file in the backend directory with the following content:


PORT=5000
### Running the Backend
Start the backend server:

node index.js
The backend server should now be running on http://localhost:5000.

### Game Flow
1. Generate Fugitive Location: The frontend calls the /api/fugitive-location endpoint to get a random fugitive location and hint.
2. Select Cities and Vehicles: Players select cities and vehicles in the frontend.
3. Determine Capture Status: The frontend calls the /api/capture-status endpoint to determine if the fugitive has been captured.