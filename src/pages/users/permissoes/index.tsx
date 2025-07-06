import { CanSSRAuth } from "@/utils/CanSSRAuth";
import Head from "next/head";
import { Header } from "@/components/ui/Header";
import styles from "./styles.module.scss";
import { Footer } from "@/components/ui/Footer";
import {
  FiRefreshCcw,
  FiEdit,
  FiFilter,
  FiPlus,
  FiTrash,
} from "react-icons/fi";

import { SiOpenaccess } from "react-icons/si";
import { setupAPIClient } from "@/services/api";
import { useState } from "react";
import Modal from "react-modal";
import Link from "next/link";
import { toast } from "react-toastify";
import { ModalDelete } from "@/components/ui/ModalDelete";

export type AccessProps = {
  id: string;
  name: string;
};

interface HomeProps {
  permissions: AccessProps[];
}

export default function Permissions({ permissions }: HomeProps) {
  const [accessList, setaccessList] = useState(permissions || []);

  const [modalVisible, setModalVisible] = useState(false);

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleDelete(id: string) {
    const apiClient = setupAPIClient();

    try {
      await apiClient.delete("/access", {
        params: {
          user_id: id,
        },
      });

      const response = await apiClient.get("/users/list");
      setaccessList(response.data);
      setModalVisible(false);

      toast.success("Permissão deletada com sucesso");
    } catch (error) {
      toast.error("Há um usuario dependendo desta permissão");
    }
  }

  Modal.setAppElement("#__next");

  if (permissions) {
    return (
      <>
        <Head>
          <title> Permissões de Acesso - Express Waiter</title>
        </Head>

        <div>
          <Header />

          <main className={styles.permissionContainer}>
            <div className={styles.permissionContent}>
              <h1>Permissões de Acesso</h1>

              <button title="Nova Permissão">
                <Link href="/users/permissoes/create" legacyBehavior>
                  <a>
                    <FiPlus size={35} color="#3fffa3" />
                  </a>
                </Link>
              </button>
            </div>

            <article className={styles.listpermissions}>
              {accessList.length === 0 && (
                <span className={styles.emptyList}>
                  Nenhuma permissão encontrada
                </span>
              )}

              {accessList.map((item) => (
                <section key={item.id} className={styles.permissionItem}>
                  <div className={styles.containerItem}>
                    <div className={styles.box}>
                      <div className={styles.tag}></div>
                      <span>{item.name}</span>
                    </div>

                    <div className={styles.buttons}>
                      {/*
                        <button
                          title="Deletar"
                          className={styles.button}
                          onClick={() => handleOpenModalView(item.id)}
                        >
                          <a>
                            <FiTrash size={24} color="#FF3F4B" />
                          </a>
                        </button>
              */}
                      <div className={styles.tag}></div>
                    </div>
                  </div>
                </section>
              ))}
            </article>
          </main>

         
          <Footer />
        </div>
      </>
    );
  } else {
    return history.go(-1), toast.error("Permissão negada");
  }
}

export const getServerSideProps = CanSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/access/list").catch((err) => {
    if (err.response) {
      return err.response;
    }
  });

  return {
    props: {
      permissions: response.data,
    },
  };
});
