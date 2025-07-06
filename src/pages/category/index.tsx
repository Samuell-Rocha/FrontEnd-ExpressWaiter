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
import { setupAPIClient } from "@/services/api";
import { useState } from "react";
import Modal from "react-modal";
import Link from "next/link";
import { toast } from "react-toastify";
import { ModalDelete } from "@/components/ui/ModalDelete";

export type CategoryProps = {
  id: string;
  name: string;
};

interface HomeProps {
  categorys: CategoryProps[];
}

export default function Category({ categorys }: HomeProps) {
  const [modalCategory, setModalCategory] = useState<CategoryProps[]>();
  const [categoryList, setcategoryList] = useState(categorys || []);

  const [modalVisible, setModalVisible] = useState(false);

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleOpenModalView(category_id: string) {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/listcategory", {
      params: {
        category_id: category_id,
      },
    });

    setModalCategory(response.data);
    setModalVisible(true);

  }

  async function handleDelete(id: string) {
    const apiClient = setupAPIClient();

    try {
      await apiClient.delete("/category", {
        params: {
          category_id: id,
        },
      });

      const response = await apiClient.get("/listcategory");
      setcategoryList(response.data);
      setModalVisible(false);

      toast.success("Categoria deletada com sucesso");
    } catch (error) {
      toast.error("Há produto dependendo desta categoria");
    }
  }

  Modal.setAppElement("#__next");

  if (categorys) {
    return (
      <>
        <Head>
          <title> Categorias - Express Waiter</title>
        </Head>

        <div>
          <Header />

          <main className={styles.categoryContainer}>
            <div className={styles.categoryContent}>
              <h1>Categorias</h1>

              <button title="Nova Categoria">
                <Link href="/category/create" legacyBehavior>
                  <a>
                    <FiPlus size={35} color="#3fffa3" />
                  </a>
                </Link>
              </button>
            </div>

            <article className={styles.listCategorys}>
              {categoryList.length === 0 && (
                <span className={styles.emptyList}>
                  Nenhuma categoria encontrada
                </span>
              )}

              {categoryList.map((item) => (
                <section key={item.id} className={styles.categoryItem}>
                  <div className={styles.containerItem}>
                    <div className={styles.box}>
                      <div className={styles.tag}></div>
                      <span>{item.name}</span>
                    </div>

                    <div className={styles.buttons}>
                      {/* <button
                      title="Deletar"
                      className={styles.button}
                      onClick={() => handleOpenModalView(item.id)}
                    >
                      <a>
                        <FiTrash size={24} color="#FF3F4B" />
                      </a>
                    </button> */}
                      <div className={styles.tag}></div>
                    </div>
                  </div>
                </section>
              ))}
            </article>
          </main>

          {modalVisible && (
            <ModalDelete
              isOpen={modalVisible}
              onRequestClose={handleCloseModal}
              item={modalCategory}
              handleDelete={handleDelete}
            />
          )}

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

  const response = await apiClient.get("/listcategory").catch((error) => {
    if (error.response) {
      return error.response;
    }
  });

  return {
    props: {
      categorys: response.data,
    },
  };
});
