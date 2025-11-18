import { supabase } from "@/lib/supabase";



export const fetchVersion = async () => {
    const { data, error } = await supabase
        .from('version')
        .select('*')
        .single();

    if (error) {
        console.error(error);
        alert('Erreur lors de la récupération de la version');
        return null;
    } else {
        return data;
    }
}

export const localVersion = {
  version: '1.0.0' 
};
