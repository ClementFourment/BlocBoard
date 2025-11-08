import { useColorScheme } from '@/hooks/use-color-scheme';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { supabase } from '../lib/supabase';

export default function Layout() {

    const colorScheme = useColorScheme();


    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     supabase.auth.getSession().then(({ data }) => {
    //     setUser(data.session?.user ?? null);
    //     setLoading(false);
    //     });

    //     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    //     setUser(session?.user ?? null);
    //     });

    //     return () => listener.subscription.unsubscribe();
    // }, []);

    useEffect(() => {
        const session = supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null);
            setLoading(false);
        });
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);


    if (loading) return null;

    // Redirection login si pas connecté
    if (!user) {
        // return <Redirect href="/login" />;
    }
    
    return (
        <ThemeProvider value={DefaultTheme}>
            <StatusBar style='auto'/>
            <Drawer
            screenOptions={{ headerShown: true }}
            drawerContent={(props) => <CustomDrawerContent {...props} /> }
            />
        </ThemeProvider>
    );
}

