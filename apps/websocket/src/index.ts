import { WebSocketServer } from 'ws';
import { User } from './user';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws) => {
  const user = new User(ws);
  ws.on('error', console.error);

  ws.on('close', () => {
    user?.destroy();
  });
});