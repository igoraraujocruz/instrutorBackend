export type Usuario = {
    id: string;
    nome: string;
    cpf: string | null;
    email: string | null;
    telefone: string | null;
    provider: string;
    providerId: string;
    foto: string | null;
}

export interface UserUpdate {
  userId: string;
  nome?: string;
  telefone?: string;
  cpf?: string;
  email?: string;
  estado?: string;
  cidade?: string;
  descricao?: string;
  preco?: number;
  slug?: string;
  latitude?: number;
  longitude?: number;
}

export interface CreateProps {
  nome: string,
  provider: string,
  providerId: string;
  email?: string;
  foto?: string;
}
