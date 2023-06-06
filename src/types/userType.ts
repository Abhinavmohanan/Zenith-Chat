export type userType = {
    name:String,
    username:String,
    email:String,
    accessToken:String,
  }

export type searchUserType = {  
   name:String,
    username:String,
}

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

export type messageType = {
  message:String,
  sender:String | undefined, //username
  receiver:String  | undefined ,//username
  date:Date,
  roomid: String,
}

export type RoomType = {_id:String,id:String,name:String | null,type:String,to:{name:String,username:String},messages:[messageType],updatedAt:Date,}

