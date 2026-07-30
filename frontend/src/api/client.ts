const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8787";

export class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("auth_token");
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async register(email: string, username: string, password: string) {
    return this.request<{ user: any; token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, username, password }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async me() {
    return this.request<{ user: any }>("/api/auth/me");
  }

  // Members
  async getMembers() {
    return this.request<any[]>("/api/members");
  }

  async getMember(id: string) {
    return this.request<any>(`/api/members/${id}`);
  }

  async createMember(data: any) {
    return this.request<any>("/api/members", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateMember(id: string, data: any) {
    return this.request<any>(`/api/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteMember(id: string) {
    return this.request<any>(`/api/members/${id}`, {
      method: "DELETE",
    });
  }

  async getTree() {
    return this.request<{ roots: any[]; all: any[] }>("/api/members/tree");
  }

  // Stats
  async getStats() {
    return this.request<any>("/api/stats");
  }

  // Settings
  async getSettings() {
    return this.request<any>("/api/settings");
  }

  async updateSettings(data: any) {
    return this.request<any>("/api/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
