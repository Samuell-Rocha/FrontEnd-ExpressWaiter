import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenErro";

import { signOut } from "@/contexts/AuthContext";

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://localhost:2627",
    headers: {
      Authorization: `Bearer ${cookies['@expresswaiter.token']}`
    }
  })

  api.interceptors.response.use((response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response.status == 401) {
        //qualquer erro 401 (não autorizado) devemos deslogar o usuario
        if (typeof window !== undefined) {
          // Chamar a função para deslogar o usuario
          signOut();
        } else {
          return Promise.reject(new AuthTokenError())
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}
