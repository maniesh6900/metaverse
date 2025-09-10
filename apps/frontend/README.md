# Metaverse House Frontend

A React-based frontend for the WebSocket multiplayer game with a house-like background and WASD movement controls.

## Features

- **House-like Background**: Beautiful animated house scene with sky, sun, trees, and grass
- **WASD Movement**: Use W, A, S, D keys to move your character around the game world
- **Real-time Multiplayer**: See other players moving in real-time
- **Simple Connection**: Just enter your User ID and Space ID to join
- **Responsive Design**: Works on both desktop and mobile devices

## How to Use

1. **Start the WebSocket Server** (runs on port 3001):
   ```bash
   cd apps/websocket
   npm run dev
   ```

2. **Start the Frontend** (runs on port 3000):
   ```bash
   cd apps/frontend
   npm run dev
   ```

3. **Open your browser** and go to `http://localhost:3000`

4. **Enter your details**:
   - User ID: Any unique identifier for your character
   - Space ID: The space/room you want to join

5. **Click "Join Space"** to connect to the game

6. **Use WASD keys** to move your character:
   - **W**: Move up
   - **A**: Move left
   - **S**: Move down
   - **D**: Move right

## Game Features

- **Grid-based Movement**: Move one square at a time
- **Boundary Detection**: Cannot move outside the game area
- **Player Visualization**: Blue circle for you, red circles for other players
- **Real-time Updates**: See other players' movements instantly
- **Connection Status**: Shows if you're connected and how many players are online

## Technical Details

- Built with React 19 and TypeScript
- Uses Tailwind CSS for styling
- WebSocket connection to backend on port 3001
- Responsive design with mobile support
- Custom house background with CSS animations
