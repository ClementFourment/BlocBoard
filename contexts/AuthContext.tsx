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
  avatarKey: number
  refreshAvatar: () => void
  fetchUserInfos: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userInfos, setUserInfos] = useState<Users | null>(null)
  const [loading, setLoading] = useState(true)
  const [avatarKey, setAvatarKey] = useState(Date.now())

  const refreshAvatar = () => {
    setAvatarKey(Date.now())
  }

  const fetchUserInfos = async (userId?: string) => {
    const targetUserId = userId || user?.id
    
    if (!targetUserId) {
      console.warn('Aucun utilisateur connecté')
      return
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', targetUserId)
        .single()

      if (error) {
        console.error('Erreur fetchUserInfos:', error)
        alert('Erreur lors de la récupération des informations de l\'utilisateur')
      } else {
        setUserInfos(data)
      }
    } catch (err) {
      console.error('Exception fetchUserInfos:', err)
    }
  }

  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        // Récupérer les infos utilisateur si connecté
        if (session?.user?.id) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (!error && data) {
            setUserInfos(data)
          }
        }
        
        setLoading(false)
      })

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event) // Debug
        setSession(session)
        setUser(session?.user ?? null)
        
        if (event === 'SIGNED_OUT') {
          console.log('Déconnexion détectée')
          setUserInfos(null)
        } else if (session?.user?.id) {
          // Récupérer les infos à la connexion
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (!error && data) {
            setUserInfos(data)
          }
        }
      }
    )
    
    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    // fetchUserInfos sera appelé automatiquement via onAuthStateChange
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
    console.log('Tentative de déconnexion...')
    
    // Nettoyer immédiatement l'état local
    setUserInfos(null)
    setUser(null)
    setSession(null)
    
    // Puis déconnecter de Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } else {
      console.log('Déconnexion réussie')
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        user, 
        userInfos, 
        loading, 
        signIn, 
        signUp, 
        signOut, 
        avatarKey, 
        refreshAvatar, 
        fetchUserInfos 
      }}
    >
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