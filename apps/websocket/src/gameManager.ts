import { OutgoingMessage } from "./type";
import { User } from "./user";

export class RoomManger {
    rooms: Map<string, User[]> = new Map();
    static instance: RoomManger;

    private constructor() {
        this.rooms = new Map();
    }
    static getInstance() {
        if(!this.instance) {
            this.instance = new RoomManger();
        }
        return this.instance;
    }
    public removeUser(user : User, spaceId : string) {
        if(!this.rooms.has(spaceId)) {
           return;
        }
        this.rooms.set(spaceId, (this.rooms.get(spaceId))?.filter((u)=> u.id !== user.id) ?? []);
    }
    public addUser(user : User, spaceId : string) {
        if(!this.rooms.has(spaceId)) {
            this.rooms.set(spaceId, [user]);
            return;
        }
        this.rooms.set(spaceId, [...(this.rooms.get(spaceId)) ?? [], user]);
    }
     public broadcast(message: OutgoingMessage, user: User, roomId: string) {
        if (!this.rooms.has(roomId)) {
            return;
        }
        this.rooms.get(roomId)?.forEach((u) => {
            if (u.id !== user.id) {
                u.send(message);
            }
        });
    }

}