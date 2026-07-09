export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Space {
  id: number;
  name: string;
  description: string | null;
  location: string;
  capacity: number;
  type: 'SALA' | 'ESCRITORIO' | 'AUDITORIO';
  price: number;
  imageUrl: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: number;
  userId: number;
  spaceId: number;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  reason: string | null;
  createdAt: string;
  updatedAt: string;
  space?: Space;
  user?: User;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}
