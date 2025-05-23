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

// General types for the consultation feature area

export interface UserProfile {
  id: string;
  name?: string;
  // Add other user-specific details as needed
}

export interface ConsultationSummary {
  consultationId: string;
  startTime: Date;
  endTime?: Date;
  finalDiagnosis?: string; // Example field
}

// You can add more shared types here as your feature grows.