import { CanSSRAuth } from "@/utils/CanSSRAuth";
import Head from "next/head";
import { Header } from "@/components/ui/Header";
import styles from "./styles.module.scss";
import { Footer } from "@/components/ui/Footer";
import socketService from "@/services/socketService";
import {
  FiRefreshCcw,
  FiEdit,
  FiFilter,
  FiPlus,
  FiTrash,
} from "react-icons/fi";

import {BsQrCodeScan} from "react-icons/bs";
import { setupAPIClient } from "@/services/api";
import { useState } from "react";
import Modal from "react-modal";
import Link from "next/link";
import { toast } from "react-toastify";
import { ModalDelete } from "@/components/ui/ModalDelete";
import { json } from "stream/consumers";
import { idText } from "typescript";
import Dashboard from "../dashboard";

export type TableProps = {
  id: number;
  qrcode: string;
};

interface HomeProps {
  tables: TableProps[];
}

export default function Table({ tables }: HomeProps, Error) {
  const [modalTable, setModalTable] = useState<TableProps[]>();
  const [tableList, settableList] = useState(tables || []);
  const [imageUrl, setImageUrl] = useState("http://localhost:2627/files/");

  const [modalVisible, setModalVisible] = useState(false);

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleOpenModalView(table_id: number) {
    const apiClient = setupAPIClient();

    const convert = table_id.toString()

    const response = await apiClient.get("/table/list", {
      params: {
        table_id: convert,
      },
    });

    setModalTable(response.data);
    setModalVisible(true);
    
  }

  async function handleDelete(id: number) {
    const apiClient = setupAPIClient();

    try {
      await apiClient.delete("/table", {
        params: {
          table_id: id,
        },
      });

      const response = await apiClient.get("/table/list/all");
      settableList(response.data);
      setModalVisible(false);

      toast.success("Mesa deletada com sucesso");
    } catch (error) {
      toast.error("Esta mesa está em atendimento");
    }
  }

  Modal.setAppElement("#__next");

  if(tables){

  return (
    <>
      <Head>
        <title> Mesas - Express Waiter</title>
      </Head>

      <div>
        <Header />

        <main className={styles.tableContainer}>
          <div className={styles.tableContent}>
            <h1>Mesas</h1>

            <button title="Cadastrar mesas">
              <Link href="/table/create" legacyBehavior>
                <a>
                  <FiPlus size={35} color="#3fffa3" />
                </a>
              </Link>
            </button>
            <button title="Gerar QR Code">
              <Link href="/table/generateqrcode" legacyBehavior>
                <a>
                  <BsQrCodeScan size={35} color="#3fffa3" />
                </a>
              </Link>
            </button>
          </div>

          <article className={styles.listTables}>
            {tableList.length === 0 && (
              <span className={styles.emptyList}>Nenhuma mesa encontrada</span>
            )}

            {tableList.map((item) => (
              <section key={item.id} className={styles.tableItem}>
                <div className={styles.containerItem}>
                  <div className={styles.box}>
                    <div className={styles.tag}></div>
                    <img
                      className={styles.image}
                      src={imageUrl + item.qrcode}
                      alt="Imagem do produto"
                      width={250}
                      height={250}
                    />
                    <span>Mesa {item.id}</span>
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
            item={modalTable}
            handleDelete={handleDelete}
          />
        )}

        <Footer />
      </div>
    </>
  );
        }
        else{
          return (history.go(-1), toast.error("Permissão negada"))
        }
}

export const getServerSideProps = CanSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  

  const response = await apiClient.get("/table/list/all") .catch((err) => {
    if (err.response) {
        return err.response
    }
});
  
  return {
    props: {
      tables: response.data,
    },
  };
});


