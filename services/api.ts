/**
 * Serviço de API para integração com backend
 * Este arquivo centraliza todas as chamadas HTTP
 */

const API_URL = import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3001/api'
    : typeof window !== 'undefined'
      ? `http://${window.location.hostname}:3001/api`
      : 'http://localhost:3001/api');

// Tipos de erro
export class APIError extends Error {
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
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(response.status, data.message || 'Erro na requisição', data);
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(500, 'Erro ao conectar com servidor', error);
  }
}

// ==================== AUTENTICAÇÃO ====================

export const authAPI = {
  /**
   * Login do usuário
   */
  login: (email: string, password: string) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  /**
   * Cadastro de novo usuário
   */
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'patient' | 'therapist_a' | 'therapist_b';
  }) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Logout do usuário
   */
  logout: () =>
    request('/auth/logout', {
      method: 'POST',
    }),

  /**
   * Verificar se token é válido
   */
  verifyToken: () =>
    request('/auth/verify', {
      method: 'GET',
    }),
};

// ==================== USUÁRIOS ====================

export const userAPI = {
  /**
   * Obter dados do usuário autenticado
   */
  getProfile: () =>
    request('/users/me', {
      method: 'GET',
    }),

  /**
   * Atualizar perfil do usuário
   */
  updateProfile: (data: any) =>
    request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Alterar senha
   */
  changePassword: (currentPassword: string, newPassword: string) =>
    request('/users/me/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  /**
   * Upload de foto de perfil
   */
  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    return fetch(`${API_URL}/users/me/profile-image`, {
      method: 'POST',
      headers,
      body: formData,
    }).then(res => res.json());
  },
};

// ==================== AGENDAMENTOS ====================

export const appointmentAPI = {
  /**
   * Listar agendamentos
   */
  list: (filters?: {
    patientId?: string;
    therapistId?: string;
    status?: string;
    from?: string;
    to?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return request(`/appointments?${params.toString()}`, {
      method: 'GET',
    });
  },

  /**
   * Obter detalhes de um agendamento
   */
  get: (id: string) =>
    request(`/appointments/${id}`, {
      method: 'GET',
    }),

  /**
   * Criar novo agendamento
   */
  create: (data: {
    patientId: string;
    therapistId: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }) =>
    request('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Atualizar agendamento
   */
  update: (id: string, data: any) =>
    request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Cancelar agendamento
   */
  cancel: (id: string) =>
    request(`/appointments/${id}`, {
      method: 'DELETE',
    }),

  /**
   * Confirmar agendamento
   */
  confirm: (id: string) =>
    request(`/appointments/${id}/confirm`, {
      method: 'POST',
    }),

  /**
   * Reagendar agendamento
   */
  reschedule: (id: string, startTime: string, endTime: string) =>
    request(`/appointments/${id}/reschedule`, {
      method: 'POST',
      body: JSON.stringify({ startTime, endTime }),
    }),
};

// ==================== MENSAGENS ====================

export const messageAPI = {
  /**
   * Listar mensagens de uma conversa
   */
  list: (conversationId: string, limit = 50, offset = 0) =>
    request(`/messages?conversationId=${conversationId}&limit=${limit}&offset=${offset}`, {
      method: 'GET',
    }),

  /**
   * Enviar mensagem
   */
  send: (data: {
    recipientId: string;
    content: string;
    attachments?: string[];
  }) =>
    request('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Marcar mensagem como lida
   */
  markAsRead: (messageId: string) =>
    request(`/messages/${messageId}/read`, {
      method: 'PUT',
    }),

  /**
   * Listar conversas
   */
  listConversations: () =>
    request('/messages/conversations', {
      method: 'GET',
    }),

  /**
   * Deletar mensagem
   */
  delete: (messageId: string) =>
    request(`/messages/${messageId}`, {
      method: 'DELETE',
    }),
};

// ==================== DOCUMENTOS ====================

export const documentAPI = {
  /**
   * Listar documentos
   */
  list: (filters?: {
    patientId?: string;
    type?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return request(`/documents?${params.toString()}`, {
      method: 'GET',
    });
  },

  /**
   * Obter detalhes de um documento
   */
  get: (id: string) =>
    request(`/documents/${id}`, {
      method: 'GET',
    }),

  /**
   * Criar novo documento
   */
  create: (data: {
    patientId: string;
    type: 'report' | 'diagnosis' | 'progress_note';
    title: string;
    content: string;
  }) =>
    request('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Atualizar documento
   */
  update: (id: string, data: any) =>
    request(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Deletar documento
   */
  delete: (id: string) =>
    request(`/documents/${id}`, {
      method: 'DELETE',
    }),

  /**
   * Download de documento
   */
  download: (id: string) => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    return fetch(`${API_URL}/documents/${id}/download`, {
      method: 'GET',
      headers,
    });
  },
};

// ==================== PACIENTES (TERAPEUTA) ====================

export const patientAPI = {
  /**
   * Listar pacientes do terapeuta
   */
  list: (filters?: {
    search?: string;
    status?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return request(`/therapist/patients?${params.toString()}`, {
      method: 'GET',
    });
  },

  /**
   * Obter detalhes de um paciente
   */
  get: (id: string) =>
    request(`/therapist/patients/${id}`, {
      method: 'GET',
    }),

  /**
   * Adicionar notas sobre paciente
   */
  addNotes: (id: string, notes: string) =>
    request(`/therapist/patients/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),
};

// ==================== TESTES/PRODUTOS ====================

export const testAPI = {
  /**
   * Listar testes disponíveis
   */
  list: () =>
    request('/tests', {
      method: 'GET',
    }),

  /**
   * Obter detalhes de um teste
   */
  get: (id: string) =>
    request(`/tests/${id}`, {
      method: 'GET',
    }),

  /**
   * Comprar teste
   */
  purchase: (testIds: string[]) =>
    request('/tests/purchase', {
      method: 'POST',
      body: JSON.stringify({ testIds }),
    }),
};

// ==================== RELATÓRIOS ====================

export const reportAPI = {
  /**
   * Gerar relatório de agendamentos
   */
  generateAppointmentReport: (filters?: any) =>
    request('/reports/appointments', {
      method: 'POST',
      body: JSON.stringify(filters),
    }),

  /**
   * Gerar relatório de pacientes
   */
  generatePatientReport: (filters?: any) =>
    request('/reports/patients', {
      method: 'POST',
      body: JSON.stringify(filters),
    }),

  /**
   * Gerar relatório de receita
   */
  generateRevenueReport: (filters?: any) =>
    request('/reports/revenue', {
      method: 'POST',
      body: JSON.stringify(filters),
    }),
};

// ==================== EXPORT ====================

export const api = {
  auth: authAPI,
  user: userAPI,
  appointment: appointmentAPI,
  message: messageAPI,
  document: documentAPI,
  patient: patientAPI,
  test: testAPI,
  report: reportAPI,
};

export default api;
