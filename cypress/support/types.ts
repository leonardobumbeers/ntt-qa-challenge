export interface SelectorMap {
  static: Record<string, string>;
  dynamic: Record<string, string>;
}

export interface User {
  nome: string;
  email: string;
  password: string;
  administrador: 'true' | 'false';
}

export interface CreatedUser extends User {
  _id: string;
}

export interface Product {
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
}

export interface CreatedProduct extends Product {
  _id: string;
}

export interface Messages {
  api: {
    created: string;
    loginSuccess: string;
    invalidCredentials: string;
    emailInUse: string;
    missingToken: string;
    adminOnly: string;
    duplicateProduct: string;
    deleted: string;
    passwordRequired: string;
  };
  ui: {
    invalidCredentials: string;
    requiredEmail: string;
    requiredPassword: string;
    emailInUse: string;
  };
}
