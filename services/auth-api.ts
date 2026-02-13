/**
 * Serviço de autenticação com backend Express
 * Este arquivo centraliza todas as chamadas relacionadas à autenticação
 */

// Usar URL da API baseada no ambiente
const API_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost'
    ? 'http://localhost:3001/api'
    : `http://${window.location.hostname}:3001/api`);
console.log('🔗 API URL configurada:', API_URL);

// Adicionar logs detalhados para depuração
const DEBUG = true; // Definir como false em produção

// Interface para o usuário
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'patient' | 'therapist_a' | 'therapist_b';
  profileImage?: string;
  therapist_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para resposta de login
interface LoginResponse {
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
  user: User;
}

// Classe de erro da API
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
  }
}

// Função auxiliar para requisições
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    console.log(`🔄 Requisição para ${endpoint}`, options.method || 'GET');
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Para logout, aceitar resposta vazia
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Erro na requisição: ${response.status}`, data);
      const errorMessage = data.error || data.message || 'Erro na requisição';
      console.log('💬 Mensagem de erro detalhada:', errorMessage);
      throw new ApiError(response.status, errorMessage, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('❌ Erro de conexão:', error);
    throw new ApiError(500, 'Erro ao conectar com servidor', error);
  }
}

// Serviço de autenticação
export const authApi = {
  /**
   * Login do usuário
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    console.log('🔐 Iniciando login para:', email);
    return request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Logout do usuário
   */
  logout: async (): Promise<void> => {
    console.log('🚪 Iniciando logout');
    return request('/logout', {
      method: 'POST',
    });
  },

  /**
   * Obter dados do usuário autenticado
   */
  getUser: async (): Promise<User> => {
    console.log('👤 Buscando dados do usuário');
    return request('/user');
  },
};

export default authApi;
