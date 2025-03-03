export type Message = {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp?: Date;
  };
  
  export type UploadedFile = {
    id: number;
    name: string;
    type: string;
  };