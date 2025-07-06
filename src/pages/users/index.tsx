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

import { RiLockPasswordFill } from "react-icons/ri";

import { SiOpenaccess } from "react-icons/si";
import { setupAPIClient } from "@/services/api";
import { useState } from "react";
import Modal from "react-modal";
import Link from "next/link";
import { toast } from "react-toastify";
import { ModalDelete } from "@/components/ui/ModalDelete";
import { FaKey } from "react-icons/fa";
import { ModalResetPassword } from "@/components/ResetPassword";

export type UserProps = {
  id: string;
  name: string;
  email: string;
};

interface HomeProps {
  users: UserProps[];
}

export default function User({ users }: HomeProps) {
  const [modalUser, setModalUser] = useState<UserProps[]>();
  const [userList, setuserList] = useState(users || []);

  const [modalController, setModalController] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  function handleCloseModal() {
    setModalVisible(false);
    setModalController("");
  }

  async function handleOpenModalReset(user_id: string) {
    try {
      const apiClient = setupAPIClient();

      const response = await apiClient.get("/users/list", {
        params: {
          user_id: user_id,
        },
      });

      setModalUser(response.data);
      setModalVisible(true);
      setModalController("2");
    } catch (error) {
      toast.warning("Nenhum item adicionado a este Pedido");
    }
  }

  async function handleOpenModalView(user_id: string) {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/users/list", {
      params: {
        user_id: user_id,
      },
    });

    setModalUser(response.data);
    setModalVisible(true);
    setModalController("1");
  }

  async function handleDelete(id: string) {
    const apiClient = setupAPIClient();

    try {
      await apiClient.delete("/users", {
        params: {
          user_id: id,
        },
      });

      const response = await apiClient.get("/users/list");
      setuserList(response.data);
      setModalVisible(false);

      toast.success("Usuário deletado com sucesso");
    } catch (error) {
      toast.error("Há produto dependendo desta categoria");
    }
  }

  Modal.setAppElement("#__next");

  if (users) {
    return (
      <>
        <Head>
          <title> Usuarios - Express Waiter</title>
        </Head>

        <div>
          <Header />

          <main className={styles.userContainer}>
            <div className={styles.userContent}>
              <h1>Usuários</h1>

              <button title="Novo Usuario">
                <Link href="/users/create" legacyBehavior>
                  <a>
                    <FiPlus size={35} color="#3fffa3" />
                  </a>
                </Link>
              </button>

              <button title="Niveis de Acesso">
                <Link href="/users/permissoes" legacyBehavior>
                  <a>
                    <FaKey size={20} color="#f7e318" />
                  </a>
                </Link>
              </button>
            </div>

            <article className={styles.listusers}>
              {userList.length === 0 && (
                <span className={styles.emptyList}>
                  Nenhum usuario encontrado
                </span>
              )}

              {userList.map((item) => (
                <section key={item.id} className={styles.userItem}>
                  <div className={styles.containerItem}>
                    <div className={styles.box}>
                      <div className={styles.tag}></div>
                      <span>{item.name}</span>
                    </div>

                    <div className={styles.buttons}>
                      {
                        <>
                          <button
                            title="Deletar"
                            className={styles.button}
                            onClick={() => handleOpenModalView(item.id)}
                          >
                            <a>
                              <FiTrash size={24} color="#FF3F4B" />
                            </a>
                          </button>
                          <button
                            title="Resetar"
                            className={styles.button}
                            onClick={() => handleOpenModalReset(item.id)}
                          >
                            <a>
                              <RiLockPasswordFill size={25} color="#eb5c2e" />
                            </a>
                          </button>
                        </>
                      }
                      <div className={styles.tag}></div>
                    </div>
                  </div>
                </section>
              ))}
            </article>
          </main>

          {modalVisible && modalController === "1" && (
            <ModalDelete
              isOpen={modalVisible}
              onRequestClose={handleCloseModal}
              item={modalUser}
              handleDelete={handleDelete}
            />
          )}

          {modalVisible && modalController === "2" && (
            <ModalResetPassword
              isOpen={modalVisible}
              onRequestClose={handleCloseModal}
              item={modalUser}
            />
          )}

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
