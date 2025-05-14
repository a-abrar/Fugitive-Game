
### Frontend README.md

```markdown
# Fugitive Hunt: Dark Pursuit - Frontend

This is the frontend application for the Fugitive Hunt game. It provides a user interface for players to interact with the game.

## Table of Contents
- [Features](#features)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Running the Frontend](#running-the-frontend)
- [Game Flow](#game-flow)

## Features

- **City Selection**: Players select cities where they think the fugitive might be hiding.
- **Vehicle Selection**: Players select vehicles that can reach the selected cities.
- **Timer**: A 2-minute timer to add urgency to the game.
- **Hints**: Cryptic hints to help players guess the fugitive's location.
- **Alerts**: Notifications to warn players when time is running out.

## Setup

### Prerequisites
- Node.js
- npm

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd path/to/frontend

**Install dependencies**:

npm install
Create a .env.local file in the frontend directory with the following content:


NEXT_PUBLIC_API_URL=http://localhost:5000

### Running the Frontend
Start the frontend development server:

npm run dev
The frontend should now be accessible at http://localhost:3000.

### Game Flow
1. Start Game: Click the "Activate Pursuit Mode" button to start the game.
2. City Selection: Select cities for each detective based on the cryptic hint.
3. Vehicle Selection: Choose vehicles that can reach the selected cities and return.
4. Determine Result: The game determines if the fugitive has been captured based on the selections.
5. Restart Game: Option to start a new game after completion.

### Additional Notes
Ensure that the backend server is running before starting the frontend to avoid any API connection issues.
The game includes a timer to enhance the challenge. Make sure your browser supports JavaScript and modern CSS features for the best experience.