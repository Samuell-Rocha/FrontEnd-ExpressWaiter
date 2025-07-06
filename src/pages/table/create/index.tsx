import Head from "next/head";
import { Footer } from "@/components/ui/Footer";
import styles from "./styles.module.scss";
import { CanSSRAuth } from "@/utils/CanSSRAuth";
import { Header } from "@/components/ui/Header";
import { setupAPIClient } from "@/services/api";
import { toast } from "react-toastify";
import { ChangeEvent, FormEvent, useState } from "react";
import { FiUpload } from "react-icons/fi";


interface user {
  users: [];
}

export default function Table({ users }: user) {
  const [table, setTable] = useState("");
  const [nameQRCode, setnameQRCode] = useState("");

  const [avatarUrl, setavatarUrl] = useState("");
  const [imageAvatar, setImageAvatar] = useState(null);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      toast.warning("Preencha todos os campos");
      return;
    }

    const image = e.target.files[0];

    if (!image) {
      return;
    }

    if (
      image.type === "image/jpeg" ||
      image.type === "image/png" ||
      image.type === "image/jpg"
    ) {
      setImageAvatar(image);
      setavatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  }

  //quando seleciona uma nova categoria na lista
  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    try {
      const data = new FormData();

      if (table === "" || imageAvatar === null || nameQRCode === "")  {
        toast.warning("Preencha todos os campos");
        return;
      }

      data.append("table_id", table);
      data.append("file", imageAvatar);
      data.append("nameqrcode", nameQRCode);

      const apiClient = setupAPIClient();
      await apiClient.post("/table", data);

      toast.success("Mesa cadastrada com sucesso");
    } catch (error) {
      toast.error("Erro ao cadastrar");
    }

    setTable("");
    setImageAvatar(null);
    setavatarUrl("");
  }

  if (users) {
    return (
      <>
        <Head>
          <title>Cadastrar Mesa - Express Waiter</title>
        </Head>

        <div>
          <Header />

          <main className={styles.container}>
            <h1>Cadastrar Mesa</h1>

            <form className={styles.form} onSubmit={handleRegister}>
              <label className={styles.labelAvatar}>
                <span>
                  <strong className={styles.strong}>QRCODE</strong>

                  <FiUpload className={styles.icon} size={30} color="#FFF" />
                </span>

                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFile}
                />

                {avatarUrl && (
                  <img
                    className={styles.preview}
                    src={avatarUrl}
                    alt="Foto do produto"
                    width={250}
                    height={250}
                  />
                )}
              </label>

              <input
                type="string"
                placeholder="Nome do QR Code gerado"
                className={styles.input}
                value={nameQRCode}
                onChange={(e) => setnameQRCode(e.target.value)}
              />

              <input
                type="number"
                placeholder="Numero da Mesa"
                className={styles.input}
                value={table}
                onChange={(e) => setTable(e.target.value)}
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
    return (history.go(-1), toast.error("Permissão Negada"))
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
