import { FormEvent, useContext, useState } from "react";
import { Header } from "@/components/ui/Header";
import Head from "next/head";
import { Footer } from "@/components/ui/Footer";
import Image from "next/image";
import styles from "./styles.module.scss";

import logoImg from "../../../../public/DesignExpressWaiter.png";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";

import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

import Link from "next/link";
import { CanSSRAuth } from "@/utils/CanSSRAuth";
import { setupAPIClient } from "@/services/api";

type ItemProps = {
  id: string;
  name: string;
};

interface TypeProps {
  typeList: ItemProps[];
}

export default function Signup({ typeList }: TypeProps) {
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState("");

  async function handleSignup(event: FormEvent) {
    event.preventDefault();

    if (name == "") {
      toast.warning("Preencha todos os campos");
      return;
    }

    try {
      const apiClient = setupAPIClient();
      await apiClient.post("/access", {
        name: name
      });

      toast.success("Permissão cadastrada com sucesso");

      setName("");
    } catch (error) {
      toast.error("Erro ao cadastrar");
    }
  }

  if (typeList) {
    return (
      <>
        <Head>
          <title>Nova Permissão de Acesso</title>
        </Head>

        <div>
          <Header />
          <main className={styles.container}>
            <h1>Cadastrar Permissão</h1>
            <form className={styles.form} onSubmit={handleSignup}>
              <Input
                placeholder="Digite o nivel de acesso"
                className={styles.input}
                type="text"
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

  const response = await apiClient.get("/access/list").catch((error) =>{
    if(error.response){
      return error.response
    }
  })

  return {
    props: {
      typeList: response.data,
    },
  };
});
