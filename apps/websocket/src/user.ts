import WebSocket from "ws";
import { RoomManger } from "./gameManager";
import { OutgoingMessage } from "./type";

function getRandomString(n : number) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < n; i+=1)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

export class User {
    public id : string;
    private userId : any;
    private spaceId : any;
    private x : number;
    private y : number;
    private ws : WebSocket;


    constructor(ws : WebSocket) {
        this.id = getRandomString(10);
        this.x = 0;
        this.y = 0;
        this.ws = ws;
        this.initHandler();
    }

    initHandler(){
        this.ws.on("message", async (data) => {
            const msg = JSON.parse(data.toString());
            console.log(msg);
            switch(msg.type){
                case "move":
                    console.log(msg.x, msg.y);
                    this.x = msg.x;
                    this.y = msg.y;
                    break;
                case "join":
                    console.log("use has joined");
                    this.userId = msg.userId;
                    this.spaceId = msg.spaceId;
                    break;
                case "disconnect":
                    this.ws.close();
                    break;
            }
        });
    }

    getSpaceId(){
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
