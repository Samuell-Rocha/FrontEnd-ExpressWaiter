import { useContext, FormEvent, useState } from "react";
import Head from "next/head";
import { Footer } from "@/components/ui/Footer";
import Image from "next/image";
import styles from "../../styles/home.module.scss";

import logoImg from "../../public/ExpressWaiterHome.png";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/Button";

import { AuthContext } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

import Link from "next/link";

import { canSSRGuest } from "@/utils/canSSRGuest";

export default function Home() {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (email == "" || password === "") {
      toast.warning("Preencha todos os campos");
      return;
    }
    try {
      setLoading(true);

    let data = {
      email,
      password,
    };

    await signIn(data);

    setLoading(false);
      
    } catch (error) {
      toast.warning("erro")
    }

    
    
  }

  return (
    <>
      <Head>
        <title>Express Waiter - Faça Seu Login</title>
      </Head>

      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Logo Express Waiter" />

        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input
              placeholder="Digite seu email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Digite sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" loading={loading}>
              Acessar
            </Button>
          </form>
          
        </div>
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
