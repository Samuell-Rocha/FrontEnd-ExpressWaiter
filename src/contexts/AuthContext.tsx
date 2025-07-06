import { createContext, ReactNode, useState, useEffect } from "react";

import { api } from "@/services/apiClient";

import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";

import { toast } from "react-toastify";

type AuthContextData = {
  user: UserProps;
  isAutenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
};

type SignInProps = {
  email: string;
  password: string;
};

type SignUpProps = {
  name: string;
  email: string;
  password: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, "@expresswaiter.token");
    Router.push("/");
  } catch {
    toast.error("Erro ao deslogar");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const isAutenticated = !!user;

  useEffect(() => {
    // tentar pegar algo no cookie (token
    const { "@expresswaiter.token": token } = parseCookies();

    if (token) {
      api
        .get("detail")
        .then((response) => {
          const { id, name, email } = response.data;

          setUser({
            id,
            name,
            email,
          });
        })

        .catch(() => {
          //se deu erro deslogamos o user
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

    

      const { id, name, token } = response.data;

      setCookie(undefined, "@expresswaiter.token", token, {
        maxAge: 60 * 60 * 24 * 30, //Expira em 1 mes
        path: "/", //Quais caminhos terão acesso ao cookie
      });

      setUser({
        id,
        name,
        email,
      });

      //passar para proximas requisições o nosso token
      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      //Redirecionar o user para uma pagina ao logar
      Router.push("/dashboard");

      toast.success("Logado com sucesso!");
    } catch (error) {
      toast.error("Email ou Senha incorreta!");
    }
  }

  async function signUp({ name, email, password }: SignUpProps) {
    try {
      const response = await api.post("/users", {
        name,
        email,
        password,
      });

      toast.success("Conta criada com sucesso!");

      Router.push("/");
    } catch (error) {
      toast.error("Erro ao cadastrar");
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAutenticated, signIn, signOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
}
