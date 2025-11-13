import { Int32 } from "react-native/Libraries/Types/CodegenTypesNamespace";


export interface Users {
  id: string;
  email: string;
  pseudo: string;
  height: Int32;
  wingspan: Int32,
  weight: Int32;
  birthday: Date;
  photo_url: string;
  visible: boolean;
  created_at: Date;
  updated_at: Date;
}