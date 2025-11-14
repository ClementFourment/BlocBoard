import { Int32 } from "react-native/Libraries/Types/CodegenTypesNamespace";


export interface Block {
  id: string;
  murId: Int32;
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
  points: Int32;
}