const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

interface ApiErrorBody {
  error?: string;
}

export class ApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiRequest<TResponse>(
  path: string,
  options?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    let message = `Erro ${response.status}`;
    try {
      const body = (await response.json()) as ApiErrorBody;
      if (body.error) {
        message = body.error;
      }
    } catch {
      // resposta sem corpo JSON — mantém a mensagem padrão
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}
