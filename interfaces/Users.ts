

export interface Users {
  id: string;
  admin: boolean;
  email: string;
  pseudo: string;
  height: number;
  wingspan: number,
  weight: number;
  birthday: Date;
  photo_url: string;
  visible: boolean;
  created_at: Date;
  updated_at: Date;
}