import { Users } from '@/interfaces/Users'
import { supabase } from '@/lib/supabase'
import { Session, User } from '@supabase/supabase-js'
import React, { createContext, useContext, useEffect, useState } from 'react'

type AuthContextType = {
  session: Session | null
  user: User | null
  userInfos: Users | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  avatarKey: number | null;
  refreshAvatar: () => void;
  fetchUserInfos: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userInfos: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  avatarKey: null,
  refreshAvatar: () => {},
  fetchUserInfos: async () => {},

})




export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userInfos, setUserInfos] = useState<Users | null>(null)
  const [loading, setLoading] = useState(true)
  const [avatarKey, setAvatarKey] = useState(Date.now());


  const refreshAvatar = () => {
    setAvatarKey(Date.now());
  };

  const fetchUserInfos = async () => {
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session?.user?.id)
            .single();

        if (error) {
            console.error(error);
            alert('Erreur lors de la récupération des informations de l\'utilisateur');
        } else {
            setUserInfos(data || []);
        }
      })
    }


  
  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        setSession(session)
        console.log(session?.user?.id)
        setUser(session?.user ?? null)
        
        setLoading(false)
      })

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, user, userInfos, loading, signIn, signUp, signOut, avatarKey, refreshAvatar, fetchUserInfos}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}