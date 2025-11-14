import { Int32 } from "react-native/Libraries/Types/CodegenTypesNamespace";


export interface Block {
  id: string;
  murId: Int32;
  colorLevel: string;
  colorBlock: string,
  ouvreur: string;
  date_ouverture: Date;
  photo_url?: string;
  actif: boolean;
  created_at: Date;
  updated_at: Date;
  points: Int32;
}