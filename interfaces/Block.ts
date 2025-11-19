

export interface Block {
  id: string;
  murId: number;
  colorLevel: string;
  colorBlock: string,
  ouvreur: string;
  date_ouverture: Date;
  photo_url?: string;
  actif: boolean;
  created_at: Date;
  updated_at: Date;
  points: number;
}