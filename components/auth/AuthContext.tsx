import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, supabaseAuth } from '../../services/supabase';
import { authApi, User as ApiUser } from '../../services/auth-api';

export type UserRole = 'patient' | 'therapist_a' | 'therapist_b';

export interface User {
  id: string;
  email: string;
  name: string;
  cpf: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
  therapist_id?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  emailPendingConfirmation: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [emailPendingConfirmation, setEmailPendingConfirmation] = useState<string | null>(null);

  // Função para carregar dados do usuário
  const loadUserData = async (userId: string) => {
    try {
      console.log('🔍 Carregando dados do usuário:', userId);
      
      // Verificar sessão atual para obter email
      const { data: sessionData } = await supabaseAuth.getSession();
      const userEmail = sessionData?.session?.user?.email || 'usuario@exemplo.com';
      const userName = sessionData?.session?.user?.user_metadata?.name || 'Usuário';
      
      // Tentar obter dados completos da tabela users
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('❌ Erro na query:', error.message, error.code, error.details);
          throw error; // Lançar erro para ser capturado pelo catch abaixo
        }
        
        if (data) {
          console.log('✅ Dados do usuário carregados da tabela users:', data.name);
          setUser({
            id: data.id,
            email: data.email,
            name: data.name,
            cpf: data.cpf,
            phone: data.phone,
            role: data.role,
            profileImage: data.profile_image,
            therapist_id: data.therapist_id,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
          });
          return; // Sair da função se os dados foram carregados com sucesso
        }
      } catch (dbError) {
        console.warn('⚠️ Erro ao buscar na tabela users, usando dados da sessão:', dbError);
      }
      
      // Se chegou aqui, não conseguiu carregar da tabela users
      // Criar usuário com dados da sessão
      console.log('✅ Usando dados da sessão:', userEmail);
      setUser({
        id: userId,
        email: userEmail,
        name: userName,
        cpf: '',
        phone: '',
        role: 'patient',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados do usuário:', error);
      // Mesmo com erro, criar um usuário temporário
      setUser({
        id: userId,
        email: 'usuario@exemplo.com',
        name: 'Usuário',
        cpf: '',
        phone: '',
        role: 'patient',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } finally {
      // Garantir que isAuthenticated seja true se temos um usuário
      setIsAuthenticated(true);
      setIsInitializing(false);
      setIsLoading(false);
    }
  };

  // Verificar sessão ao iniciar
  useEffect(() => {
    console.log('🔄 Inicializando autenticação...');
    
    const checkSession = async () => {
      try {
        // Verificar se há token no localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('❌ Nenhum token encontrado');
          setIsAuthenticated(false);
          setUser(null);
          setIsInitializing(false);
          setIsLoading(false);
          return;
        }
        
        console.log('🔍 Verificando sessão existente...');
        
        // Buscar dados do usuário usando a nova API
        const userData = await authApi.getUser();
        console.log('✅ Dados do usuário carregados:', userData.name);
        
        // Converter ApiUser para User
        const user: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          cpf: userData.cpf || '',
          phone: userData.phone || '',
          role: userData.role,
          profileImage: userData.profileImage,
          therapist_id: userData.therapist_id,
          createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
          updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date(),
        };
        
        // Definir usuário e estado de autenticação
        setUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('❌ Erro ao verificar sessão:', error);
        // Em caso de erro, limpar token e estado
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsInitializing(false);
        setIsLoading(false);
      }
    };
    
    // Verificar sessão existente
    checkSession();
    
    return () => {
      // Nada para limpar
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Iniciando login para:', email);
      
      // Usar a nova API de autenticação
      const response = await authApi.login(email, password);
      
      console.log('Login bem-sucedido para:', email);
      
      // Armazenar token para uso em API
      localStorage.setItem('token', response.session.access_token);
      
      // Definir isAuthenticated como true imediatamente
      setIsAuthenticated(true);
      
      // Limpar email pendente ao fazer login com sucesso
      setEmailPendingConfirmation(null);
      
      // Converter ApiUser para User
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        cpf: response.user.cpf || '',
        phone: response.user.phone || '',
        role: response.user.role,
        profileImage: response.user.profileImage,
        therapist_id: response.user.therapist_id,
        createdAt: response.user.createdAt ? new Date(response.user.createdAt) : new Date(),
        updatedAt: response.user.updatedAt ? new Date(response.user.updatedAt) : new Date(),
      };
      
      // Definir usuário
      setUser(userData);
      
      // Log para debug
      console.log('✅ Usuário definido após login:', userData.name);
      
    } catch (error) {
      console.error('❌ Erro ao fazer login:', error);
      
      // Se o erro for de email não confirmado
      if (error instanceof Error && error.message.includes('not confirmed')) {
        setEmailPendingConfirmation(email);
      }
      
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string; therapistId?: string }) => {
    setIsLoading(true);
    try {
      // Criar usuário no Auth do Supabase
      const { data: authData, error: authError } = await supabaseAuth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Criar registro do usuário na tabela users
        const userRecord: any = {
          id: authData.user.id,
          email: userData.email,
          cpf: userData.cpf,
          name: userData.name,
          phone: userData.phone,
          role: userData.role,
        };

        // Adicionar therapist_id se for paciente
        if (userData.role === 'patient' && userData.therapistId) {
          userRecord.therapist_id = userData.therapistId;
        }

        const { error: dbError } = await supabase
          .from('users')
          .insert([userRecord]);

        if (dbError) {
          console.error('Erro ao criar usuário na tabela:', dbError);
          throw dbError;
        }

        setUser({
          id: authData.user.id,
          email: userData.email,
          name: userData.name,
          cpf: userData.cpf,
          phone: userData.phone,
          role: userData.role,
          therapist_id: userData.therapistId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        
        console.log('✅ Usuário registrado com sucesso:', userData.email, 'Terapeuta:', userData.therapistId);
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Iniciando logout...');
      
      // Fazer logout na API
      await authApi.logout();
      
      // Limpar estado local
      setUser(null);
      setIsAuthenticated(false);
      setEmailPendingConfirmation(null);
      
      // Remover token do localStorage
      localStorage.removeItem('token');
      
      console.log('✅ Logout bem-sucedido!');
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
      
      // Mesmo com erro, garantir que o estado local foi limpo
      setUser(null);
      setIsAuthenticated(false);
      setEmailPendingConfirmation(null);
      localStorage.removeItem('token');
      
      throw error;
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabaseAuth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao reenviar email de confirmação:', error);
      throw error;
    }
  };

  // Gerenciar estado de autenticação separadamente do usuário
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Verificar autenticação sempre que o usuário ou token mudar
  useEffect(() => {
    const checkAuth = async () => {
      // Verificar se há usuário carregado
      if (user) {
        setIsAuthenticated(true);
        return;
      }
      
      // Verificar se há token válido
      try {
        const token = localStorage.getItem('token');
        const supabaseAuthData = localStorage.getItem('supabase-auth');
        
        if (token && supabaseAuthData) {
          const { data } = await supabaseAuth.getSession();
          if (data?.session) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            // Limpar tokens inválidos
            localStorage.removeItem('token');
            localStorage.removeItem('supabase-auth');
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, [user]);
  
  // Log para debug do estado de autenticação
  useEffect(() => {
    console.log('AuthContext - Estado de autenticação atualizado:', { 
      user: user?.email || 'null', 
      isAuthenticated,
      isLoading 
    });
  }, [user, isAuthenticated, isLoading]);
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, emailPendingConfirmation, login, register, logout, resendConfirmationEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
