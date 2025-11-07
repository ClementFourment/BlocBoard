

export interface Block {
  id: string;
  nom: string;
  couleur: string;
  color: string,
  cotation: string;
  ouvreur: string;
  date_ouverture: Date;
  photo_url?: string;
  actif: boolean;
  created_at: Date;
  updated_at: Date;
}