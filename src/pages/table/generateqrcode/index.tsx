import { Header } from "@/components/ui/Header";
import Head from "next/head";
import { Footer } from "@/components/ui/Footer";
import styles from "./styles.module.scss";
import { FormEvent, useState } from "react";

import { setupAPIClient } from "@/services/api";
import { toast } from "react-toastify";

import { CanSSRAuth } from "@/utils/CanSSRAuth";

import QRCode from "qrcode";
import QRCodeLink from "qrcode";

interface user {
  users: [];
}

export default function QRCodeCreate({ users }: user) {
  const [text, setText] = useState("");
  const [imageUrl, setimageUrl] = useState("");

  const generateQrCode = async () => {
    try {
      const response = await QRCode.toDataURL(text);
      setimageUrl(response);

      toast.success("QR Code gerado com sucesso");

      setText("");
    } catch (error) {
      toast.error("erro");
    }
  };

  if (users) {
    return (
      <>
        <Head>
          <title>Gerar QRCode - Express Waiter</title>
        </Head>
        <div>
          <Header />

          <main className={styles.container}>
            <h1>Gerar QR Code</h1>
            {imageUrl && (
              <a className={styles.qrcode} href={imageUrl} download>
                {" "}
                <img src={imageUrl} alt="img" />
                Clique na imagem para fazer download
              </a>
            )}

            <input
              type="text"
              placeholder="Digite um nome para o qrcode"
              className={styles.input}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button
              className={styles.buttonAdd}
              onClick={() => generateQrCode()}
            >
              Gerar
            </button>
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
