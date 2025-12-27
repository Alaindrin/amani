const API_BASE_URL = 'http://localhost:3001/api';

export interface QuotationRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  description: string;
}

export interface MessageRequest {
  name: string;
  email: string;
  message: string;
}

export interface Quotation {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  project_type: string;
  budget?: string;
  timeline?: string;
  description: string;
  status: 'pending' | 'reviewed' | 'responded';
  created_at: string;
  updated_at: string;
}

export interface Message extends MessageRequest {
  id: number;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
}

export interface Stats {
  total: number;
  pending?: number;
  reviewed?: number;
  responded?: number;
  unread?: number;
  read?: number;
  replied?: number;
}

// Quotation API
export const quotationAPI = {
  create: async (data: QuotationRequest) => {
    const response = await fetch(`${API_BASE_URL}/quotations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getAll: async (): Promise<{ success: boolean; data: Quotation[] }> => {
    const response = await fetch(`${API_BASE_URL}/quotations`);
    return response.json();
  },

  getStats: async (): Promise<{ success: boolean; data: Stats }> => {
    const response = await fetch(`${API_BASE_URL}/quotations/stats`);
    return response.json();
  },

  updateStatus: async (id: number, status: string) => {
    const response = await fetch(`${API_BASE_URL}/quotations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/quotations/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Message API
export const messageAPI = {
  create: async (data: MessageRequest) => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getAll: async (): Promise<{ success: boolean; data: Message[] }> => {
    const response = await fetch(`${API_BASE_URL}/messages`);
    return response.json();
  },

  getStats: async (): Promise<{ success: boolean; data: Stats }> => {
    const response = await fetch(`${API_BASE_URL}/messages/stats`);
    return response.json();
  },

  updateStatus: async (id: number, status: string) => {
    const response = await fetch(`${API_BASE_URL}/messages/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};