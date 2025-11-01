export interface Address {
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'customer' | 'admin';
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: Date;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  addresses?: Address[];
}