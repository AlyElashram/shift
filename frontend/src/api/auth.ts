import client from './client';

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>('/auth/login', {
    user: { email, password },
  });

  if (response.data.token) {
    localStorage.setItem('jwt_token', response.data.token);
  }

  return response.data;
}

export async function logout(): Promise<void> {
  try {
    await client.delete('/auth/logout');
  } finally {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
  }
}

export async function getMe(): Promise<LoginResponse> {
  const response = await client.get<LoginResponse>('/auth/me');
  return response.data;
}
