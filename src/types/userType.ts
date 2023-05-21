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

