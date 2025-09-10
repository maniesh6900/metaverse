import WebSocket from "ws";
import { RoomManger } from "./gameManager";
import { OutgoingMessage } from "./type";
import jwt, { JwtPayload } from "jsonwebtoken";
import { client } from "@repo/db/client";
const JWT_secret = 'maniesh';



function getRandomString(n: number): string {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < n; i += 1)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

export class User {
    public id: string;
    private userId: any;
    private spaceId: any;
    private x: number;
    private y: number;
    private ws: WebSocket;


    constructor(ws: WebSocket) {
        this.id = getRandomString(10);
        this.x = 0;
        this.y = 0;
        this.ws = ws;
        this.initHandler();
    }

    initHandler() {
        this.ws.on("message", async (data) => {
            const msg = JSON.parse(data.toString());
            // console.log(msg);
            // console.log( this.id);
            
            switch (msg.type) {
                case "join":
                    const { token } = msg.payload;
                    const { spaceId } = msg.payload;
                    const { userId } = (jwt.verify(token, JWT_secret) as JwtPayload);
                    if (!userId) {
                        this.ws.close();
                        return;
                    }
                    this.userId = userId;
                    const space = await client.space.findFirst({
                        where: {
                            id: spaceId,
                        },
                    });
                    if (!space) {
                        this.ws.close();
                        return;
                    }
                    this.spaceId = spaceId;
                    RoomManger.getInstance().addUser(this, spaceId);
                    this.x = Math.floor(Math.random() * space?.width);
                    this.y = Math.floor(Math.random() * space?.height);
                    this.send({
                        type: "joined",
                        payload: {
                            userId : this.id,
                            x: this.x,
                            y: this.y,
                        },
                        user: RoomManger.getInstance().rooms.get(spaceId)?.filter(x => x.id !== this.id)?.map((u) => ({ id: u.id })) ?? [],
                    });
                    
                    RoomManger.getInstance().broadcast({
                        type: "user-joined",
                        payload: {
                            userId: this.id,
                            x: this.x,
                            y: this.y,
                        },
                    }, this, this.spaceId!);
                    break;
                case "move":
                    const moveX = msg.payload.x;
                    const moveY = msg.payload.y;
                    const xDisplacement = Math.abs(this.x - moveX);
                    const yDisplacement = Math.abs(this.y - moveY);
                    if ((xDisplacement == 1 && yDisplacement == 0) || (xDisplacement == 0 && yDisplacement == 1)) {
                        this.x = moveX;
                        this.y = moveY;
                        RoomManger.getInstance().broadcast({
                            type: "movement",
                            payload: {
                                userId: this.id,
                                x: moveX,
                                y: moveY,
                            },
                        }, this, this.spaceId);
                        return;
                    } 
                    this.send({
                        type: "movement-rejected",
                        payload: {
                            x: this.x,
                            y: this.y,
                        },
                    });
                    
                    break;
                case "disconnect":
                    this.ws.close();
                    break;
            }
        });
    }

    getSpaceId() {
        return this.spaceId;
    }
    send(payload: OutgoingMessage) {
        this.ws.send(JSON.stringify(payload));
    }
    destroy() {
        RoomManger.getInstance().broadcast({
            type: "user-left",
            payload: {
                userId: this.userId,
            },
        }, this, this.spaceId!);
        RoomManger.getInstance().removeUser(this, this.spaceId!);
    }

}
