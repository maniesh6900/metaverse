import { Space } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {User} from 'lucide-react';
interface Space {
  id: string;
  width: number;
  height: number;
}



// 100x cme124zli0001uf3s2nwa196o
// 20x cme1v7ri20001uf9oe0vofeuo

const Arena = () => {

  const param = useParams();
  param.spaceid;


  const canvasRef = useRef<any>(null);
  const wsRef = useRef<any>(null);
  const [currentUser, setCurrentUser] = useState<any>({});
  const [users, setUsers] = useState(new Map());
  const [params, setParams] = useState({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWUxMWJybHUwMDAwdWZlNDN6OGlidWxvIiwiaWF0IjoxNzU3MTA2MzEzfQ.1qRuhXuJiwKOjLxFDRfQmuDtWXLsV8YvDkLxHEJuzuc", spaceId:  param.spaceid});

  const [limits, setLimits] = useState({ x: 0, y: 0 });
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [res, SetRes] = useState<Space | null>(null);

  

  // Initialize WebSocket connection and handle URL params
  
  useEffect(() => {
    ;(async() => {
      const res = await axios.get(`http://localhost:3000/api/v1/user/space/${params.spaceId}`);
      SetRes(res.data.data.space);
      console.log(res.data.data.space);
    })();
  },[]);
  
  useEffect(() => {
    if (res) {
      setLimits({ x: res.width ? res.width : 0, y: res.height ? res.height : 0 });
    }
  }, [res]);

  useEffect(() => {

    // Initialize WebSocket
    wsRef.current = new WebSocket('ws://localhost:3001'); // Replace with your WS_URL
    
    wsRef.current.onopen = () => {
      // Join the space once connected
      wsRef.current.send(JSON.stringify({
        type: 'join',
        payload: {
          spaceId: params.spaceId,
          token: params.token,
        },
      }));
    };

    wsRef.current.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'joined':
        console.log("joined");
        // Initialize current user position and other users
        console.log("set");
        console.log({
            x: message.payload.x,
            y: message.payload.y,
            userId: message.payload.userId,
          });
        setCurrentUser({
          x: message.payload.x,
          y: message.payload.y,
          userId: message.payload.userId,
          ws: wsRef.current,
          SpaceId : params.spaceId,
        });

        setCamera({
          x : message.payload.x,
          y : message.payload.y,
        });

        break;
        // Initialize other users from the payload
       case 'user-joined':
        console.log("user-joined");
          setUsers(prev => {
          const newUsers = new Map(prev);
            newUsers.set(message.payload.userId, {
              x: message.payload.x,
              y: message.payload.y,
              userId: message.payload.userId,
            });
          return newUsers;
        });
        break;
      case 'movement':
        console.log("movement");
        setUsers(prev => {
          const newUsers = new Map(prev);
          const user = newUsers.get(message.payload.userId); 
          if (user) {
            user.x = message.payload.x;
            user.y = message.payload.y;
            newUsers.set(message.payload.userId, user);
          }
          return newUsers;
        });
        break;
      case 'movement-rejected':
        console.log("movement-rejected");
        // Reset current user position if movement was rejected
        setCurrentUser((prev: any) => ({
          ...prev,
          x: message.payload.x,
          y: message.payload.y,
        }));
        break;

      case 'user-left':
        console.log("user left");
        setUsers(prev => {
          const newUsers = new Map(prev);
          newUsers.delete(message.payload.userId);
          return newUsers;
        });
        break;
    }
  };

  // Handle user movement
  const handleMove = (newX: number, newY: number) => {
    if (!currentUser) return;

    // console.log("newX, newY");
    // console.log(newX, newY);
    
    // Send movement request
    wsRef.current.send(JSON.stringify({
      type: 'move',
      payload: {
        userId: currentUser.userId,
        x: newX,
        y: newY,
      },
      data: wsRef.current,
      spaceId : params.spaceId,
    }));

    currentUser.x = newX;
    currentUser.y = newY;
    setCurrentUser({ ...currentUser });
  };

  // Draw the arena
 useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Save context state
      ctx.save();
      
      // Update camera to follow character
      const targetCameraX = currentUser.x - canvas.width / 2;
      const targetCameraY = currentUser.y - canvas.height / 2;
      
      setCamera(prev => ({
        x: prev.x + (targetCameraX - prev.x) * 0.1, // Smooth camera movement
        y: prev.y + (targetCameraY - prev.y) * 0.1,
      }));
      
      // Apply camera transformation
      ctx.translate(-camera.x, -camera.y);
      
      // Draw background with reduced opacity
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = '#E8E8E8';
      ctx.fillRect(camera.x - 100, camera.y - 100, canvas.width + 200, canvas.height + 200);
      
      // Draw background elements (dimmed)
      // ctx.globalAlpha = 0.3;
      // // backgroundElements.forEach(element => {
      // //   ctx.fillStyle = element.color;
      // //   ctx.fillRect(element.x, element.y, element.width, element.height);
      // // });
      
      // Draw character with full emphasis
      ctx.globalAlpha = 1.0;
      
      // Add glow effect around character
      ctx.shadowColor = currentUser.color;
      ctx.shadowBlur = 15;
      ctx.fillRect(currentUser.x, currentUser.y, currentUser.width, currentUser.height);
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      // Add character details
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(currentUser.x + 15, currentUser.y + 10, 10, 10); // Left eye
      ctx.fillRect(currentUser.x + 35, currentUser.y + 10, 10, 10); // Right eye
      
      // Add subtle outline
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(currentUser.x, currentUser.y, currentUser.width, currentUser.height);
      
      // Restore context state
      ctx.restore();
      
      // Draw UI elements (not affected by camera)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.font = '26px Arial';
      ctx.fillText(`Character Position: (${Math.round(currentUser.x)}, ${Math.round(currentUser.y)})`, 200, 40);
      ctx.fillText('Use WASD or Arrow Keys to move', 200, 70);
      
      // Draw current user
    if (currentUser && currentUser) {
      // console.log("drawing myself");
      // console.log(currentUser);
      ctx.beginPath();
      ctx.fillStyle = '#FF6B6B';
      ctx.arc(currentUser.x * 50, currentUser.y * 50, ( 2 * (Math.random() + ((limits.x + limits.y)/10))), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = `14px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('You', currentUser.x * 50, currentUser.y * 50 - 20);
    }

    // Draw other users
    users.forEach(user => {
    // console.log("drawing other user");
    // console.log(user);
      ctx.beginPath();
      ctx.fillStyle = '#4ECDC4';
       ctx.arc(user.x * 50, user.y * 50, ( 2 * (Math.random() + ((limits.x + limits.y)/10))), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`User ${user.userId}`, user.x * 50, user.y * 50 - 20);
    });
  };
    render();
  }, [currentUser, camera]);

  const handleKeyDown = (e: any) => {
    console.log("key down");
    if (!currentUser) return;

    const { x, y } = currentUser;
    
    switch (e.key) {
      case 'ArrowUp':

        if ((y -1 ) != 0){
          handleMove(x, y - 1);
        } else {
          alert("Border limit reached");
        }
        break;
      case 'ArrowDown':
        if ((y + 1 )!= limits.y) {
          handleMove(x, y + 1);
        } else {
          alert("Border limit reached");
        }
    
        break;
      case 'ArrowLeft':
        if ((x - 1) != 0) {
          handleMove(x - 1, y);
        } else {
          alert("Border limit reached");
        }
        break;
      case 'ArrowRight':
        if ((x + 1) != limits.x) {
          handleMove(x + 1, y);
        } else {
          alert("Border limit reached");
        }
        break;
    }
  };



  return (
    <div className="p-4 w-full h-screen" onKeyDown={handleKeyDown} tabIndex={0}>
        <h1 className="text-2xl font-bold mb-4">Arena</h1>
        <div className="mb-4">
          {/* <p className="text-sm text-gray-600">Token: {params.token}</p>
          <p className="text-sm text-gray-600">Space ID: {params.spaceId}</p> */}
          <p className="text-sm text-gray-600 flex flex-row "  ><User size={18} color='black'  /> : {users.size + (currentUser ? 1 : 0)}</p>
        </div>
        <div className="border rounded-lg overflow-hidden w-full ">
          <canvas
            ref={canvasRef}
            width={`${(limits.x * 50) + 1}`}
            height={`${(limits.y * 50) + 1}`}
            className="h-full w-full border border-gray-300 cursor-pointer"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">Use arrow keys to move your avatar</p>
    </div>
  );
};

export default Arena;