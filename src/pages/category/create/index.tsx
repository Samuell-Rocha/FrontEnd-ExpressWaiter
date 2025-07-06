import { Header } from "@/components/ui/Header";
import Head from "next/head";
import { Footer } from "@/components/ui/Footer";
import styles from "./styles.module.scss";
import { FormEvent, useState } from "react";

import { setupAPIClient } from "@/services/api";
import { toast } from "react-toastify";

import { CanSSRAuth } from "@/utils/CanSSRAuth";

interface user {
  users: [];
}

export default function Category({ users }: user) {
  const [name, setName] = useState("");

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if (name === "") {
      toast.warning("Preencha todos os campos");
      return;
    }
    try {
      const apiClient = setupAPIClient();
      await apiClient.post("/category", {
        name: name,
      });

      toast.success("Categoria cadastrada com sucesso");
      setName("");
    } catch (error) {
      toast.error("Erro ao cadastrar");
    }
  }

  if (users) {
    return (
      <>
        <Head>
          <title>Nova Categoria - Express Waiter</title>
        </Head>
        <div>
          <Header />

          <main className={styles.container}>
            <h1>Cadastrar Categorias</h1>

            <form className={styles.form} onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Digite o nome da categoria"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <button className={styles.buttonAdd} type="submit">
                Cadastrar
              </button>
            </form>
          </main>
          <Footer />
        </div>
      </>
    );
  } else {
    return history.go(-1), toast.error("Permissão Negada");
  }
}

export const getServerSideProps = CanSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/users/list").catch((err) => {
    if (err.response) {
      return err.response;
    }
  });
  return {
    props: {
      users: response.data,
    },
  };
});
