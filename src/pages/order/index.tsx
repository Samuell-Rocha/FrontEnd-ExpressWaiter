import { CanSSRAuth } from "@/utils/CanSSRAuth";
import { SyntheticEvent, useEffect, useState } from "react";
import Head from "next/head";
import styles from "./style.module.scss";
import { Header } from "@/components/ui/Header";
import { setupAPIClient } from "../../services/api";
import { FiFilter, FiRefreshCcw } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { MdLunchDining } from "react-icons/md";
import { BiSelectMultiple, BiSolidReport } from "react-icons/bi";
import Modal from "react-modal";
import { ModalOrderDetail } from "@/components/ModalOrder/ModalOrderDetail";
import { ModalCancel } from "@/components/ModalOrder/ModalCancel";
import { ModalTake } from "@/components/ModalOrder/ModalTake";
import { ModalFinish } from "@/components/ModalOrder/ModalFinish";
import { Footer } from "@/components/ui/Footer";
import { toast } from "react-toastify";
import { TableCell, TDocumentDefinitions } from "pdfmake/interfaces";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import socketService from "@/services/socketService";
import Swal from "sweetalert2";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export type OrderProps = {
  id: string;
  name: string;
  table_id: string;
  status: string;
  Rating: {
    id: string;
    service: number | string;
  };
  total: number;
  created_at: string;
  OrderItem: {
    product: {
      name: string;
    };
  };
};

interface HomeProps {
  orders: OrderProps[];
}

export type OrderItemProps = {
  id: string;
  amount: number;
  price: number;
  total: number;
  order_id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    banner: string;
    estimated_time: string | null;
  };
  order: {
    id: string;
    name: string;
    status: string;
    total: number;
    table_id: number;
    Rating: {
      id: string;
      establishment: number;
      food: number;
      service: number;
      waitingtime: number;
    };
  };
  Rating: {
    id: string;
    establishment: number;
    food: number;
    service: number;
    waitingtime: number;
  };

  table: {
    id: string;
    table: number;
  };
};

export default function Product({ orders }: HomeProps) {
  const [orderList, setorderList] = useState(orders || []);
  const [modalOrder, setmodalOrder] = useState<OrderProps[]>();

  const [modalItem, setModalItem] = useState<OrderItemProps[]>();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalController, setModalController] = useState("");

  const [orderListiItem, setorderListiItem] = useState<OrderItemProps[]>([]);

  useEffect(() => {
    socketService.on("chat.message", (table: any) => {
      Swal.fire(
        "O(A) Sr(a) " + table.name + " está chamando na mesa " + table.table
      );
    });
  }, []);

  useEffect(() => {
    const chatMessageHandler = async (table: any) => {
      const apiClient = setupAPIClient();
      const response = await apiClient.get("/order/list");
      setorderList(response.data);
    };

    socketService.on("delete.order", chatMessageHandler);
    socketService.on("open.table", chatMessageHandler);
    socketService.on("send.order", chatMessageHandler);

    return () => {
      socketService.off("open.table", chatMessageHandler);
      socketService.off("delete.order", chatMessageHandler);
      socketService.off("send.order", chatMessageHandler);
    };
  }, []);

  async function handleReport() {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get("/users/list");

      const date = new Date().toLocaleString();

      const body = [];

      const columnsTitle: TableCell[] = [
        { text: "Data", style: "columnsTitle" },
        { text: "Mesa", style: "name" },
        { text: "Name", style: "columnsTitle" },
        { text: "Pedido", style: "columnsTitle" },
        { text: "Total", style: "columnsTitle" },
      ];

      const columnsBody = new Array();

      columnsTitle.forEach((column) => columnsBody.push(column));
      body.push(columnsBody);

      for await (let order of orderList) {
        const rows = new Array();

        var d = new Date(order.created_at);

        rows.push(
          d.toLocaleDateString("en-GB") + " " + d.toLocaleTimeString("it-IT")
        );
        rows.push(order.table_id);
        rows.push(order.name);
        const productNames = Array.isArray(order.OrderItem)
        ? order.OrderItem.map((item: any) => item.product?.name).filter(Boolean)
        : [];
      
      const productName = productNames.join(', ');
    
      rows.push(productName);
        rows.push(`R$ ${Number(order.total.toString()).toFixed(2)}`);

        body.push(rows);
      }

      const docDefinitions: TDocumentDefinitions = {
        content: [
          {
            columns: [
              { text: "Relatório de Pedidos", style: "header" },
              { text: date + "\n\n", style: "header" },
            ],
          },
          {
            table: {
              headerRows: 1,
              widths: [120, 50, 100, 140, 80],
              body: body.map(row => row.map(cell => ({ text: cell, style: cell.style || 'defaultStyle' }))),
            },
            layout: {
              defaultBorder: false,
              fillColor: function (i: number, node: any) {
                return i % 2 === 0 ? "#F0F0F0" : null;
              },
            },
          },
        ],

        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: "center",
            margin: [0, 0, 0, 10],
            
          },
          columnsTitle: {
            fontSize: 13,
            bold: true,
            fillColor: "#7159c1",
            color: "#FFF",
            alignment: "center",
            margin: 4,
          },
          name: {
            fillColor: "#999",
            color: "#FFF",
            margin: 4,
            alignment: "center"
          },
          tableHeader: {
            fillColor: "#7159c1",
            color: "#FFF",
            alignment: "center",
            bold: true,
            fontSize: 13,
            margin: 4,
          },
          defaultStyle: {
            alignment: "center", // Adicione esta linha para centralizar todo o conteúdo por padrão
          },
        },
      };

      const pdfgenerator = pdfMake.createPdf(docDefinitions);

      pdfgenerator.download();
    } catch (error) {
      toast.error("Permissão Negada");
    }
  }

  function handleCloseModal() {
    setModalVisible(false);
    setModalController("");
  }

  function handleColor(item: string) {
    if (item === "Em Atendimento") {
      return styles.atendimento;
    }
    if (item === "Pedido Pronto") {
      return styles.entregue;
    }
    if (item === "Pedido Finalizado") {
      return styles.finalizado;
    }
    if (item === "Cancelado") {
      return styles.cancelado;
    }
  }

  async function handleOpenModalView(id: string) {
    try {
      const apiClient = setupAPIClient();

      const response = await apiClient.get("/order/detail", {
        params: {
          order_id: id,
        },
      });

      setModalItem(response.data);
      setModalVisible(true);
      setModalController("1");
    } catch (error) {
      toast.warning("Nenhum item adicionado a este Pedido");
    }
  }

  async function handleOpenModalCancel(order_id: string) {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/order/list", {
      params: {
        order_id: order_id,
      },
    });

    setmodalOrder(response.data);
    setModalVisible(true);
    setModalController("2");
  }

  async function handleCancel(id: string) {
    const apiClient = setupAPIClient();

    try {
      await apiClient.put("/order/cancel", {
        order_id: id,
      });

      const response = await apiClient.get("/order/list");

      socketService.emit("cancel.order", {
        status: "Cancelado",
      });

      setorderList(response.data);
      setModalVisible(false);

      toast.success("Pedido cancelado com sucesso");
    } catch (error) {
      toast.error("Erro");
    }
  }

  async function handleOpenModalTake(order_id: string) {
    try {
      const apiClient = setupAPIClient();

      const response = await apiClient.get("/order/list", {
        params: {
          order_id: order_id,
        },
      });

      setmodalOrder(response.data);
      setModalVisible(true);
      setModalController("3");
    } catch (error) {
      toast.warning("erro");
    }
  }

  async function handleTake(id: string) {
    const apiClient = setupAPIClient();

    try {
      await apiClient.put("/order/concluded", {
        order_id: id,
      });

      const response = await apiClient.get("/order/list");

      socketService.emit("status.ready", {
        status: "Pedido Pronto",
      });

      setorderList(response.data);
      setModalVisible(false);

      toast.success("Pedido Entregue com sucesso");
    } catch (error) {
      toast.error("Erro");
    }
  }

  async function handleOpenModalFinish(id: string) {
    try {
      const apiClient = setupAPIClient();

      const response = await apiClient.get("/order/list", {
        params: {
          order_id: id,
        },
      });

      setmodalOrder(response.data);
      setModalVisible(true);
      setModalController("4");
    } catch (error) {
      toast.warning("erro");
    }
  }

  async function handleFinish(id: string) {
    const apiClient = setupAPIClient();

    try {
      await apiClient.put("/order/finish", {
        order_id: id,
      });

      const response = await apiClient.get("/order/list");

      socketService.emit("status.finish", {
        status: "Pedido Finalizado",
      });
      setorderList(response.data);
      setModalVisible(false);

      toast.success("Pedido Finalizado com sucesso");
    } catch (error) {
      toast.error("Erro");
    }
  }

  async function handleRefreshOrders() {
    const apiClient = setupAPIClient();

    const response = await apiClient.get("/order/list");

    setorderList(response.data);
    toast.success("Recarregado");
  }

  async function handleChangeOrder(event: { target: { value: string } }) {
    const apiClient = setupAPIClient();

    if (event.target.value === "Todos") {
      const response = await apiClient.get("/order/list");
      setorderList(response.data);
    } else if (event.target.value === "Aberto") {
      const response = await apiClient.get("/order/list/open");
      setorderList(response.data);
    } else if (event.target.value === "Em Atendimento") {
      const response = await apiClient.get("/order/list/attendance");
      setorderList(response.data);
    } else if (event.target.value === "Entregue") {
      const response = await apiClient.get("/order/list/prepared");
      setorderList(response.data);
    } else if (event.target.value === "Finalizado") {
      const response = await apiClient.get("/order/list/finish");
      setorderList(response.data);
    } else if (event.target.value === "Cancelado") {
      const response = await apiClient.get("/order/list/cancel");
      setorderList(response.data);
    }
  }

  Modal.setAppElement("#__next");

  return (
    <>
      <Head>
        <title> Pedidos - Express Waiter</title>
      </Head>

      <div>
        <Header />

        <main className={styles.orderContainer}>
          <div className={styles.container}>
            <div className={styles.recharge}>
              <h1>Pedidos</h1>
              <button onClick={handleRefreshOrders}>
                <FiRefreshCcw size={25} color="3fffa3" />
              </button>
            </div>

            <div className={styles.filter}>
              <FiFilter size={30} />
              <select onChange={handleChangeOrder}>
                <option key={"#1"}>Todos</option>
                <option key={"#2"}>Aberto</option>
                <option key={"#3"}>Em Atendimento</option>
                <option key={"#4"}>Entregue</option>
                <option key={"#5"}>Finalizado</option>
                <option key={"#6"}>Cancelado</option>
              </select>
            </div>

            <div>
              <button
                title="Gerar Relatório"
                className={styles.button}
                onClick={handleReport}
              >
                <a>
                  <BiSolidReport size={45} color="#fddc8f" />
                </a>
              </button>
            </div>
          </div>

          <article className={styles.listOrders}>
            {orderList.length === 0 && (
              <span className={styles.emptyList}>Nenhum pedido</span>
            )}

            {orderList.map((item) => {
              return (
                <section key={item.id} className={styles.orderItem}>
                  <div className={styles.containerItem}>
                    <div className={styles.box}>
                      <div
                        className={`${styles.tag} ${handleColor(item.status)}`}
                      ></div>
                      <span>
                        Mesa {item.table_id} - {item.name}
                      </span>
                    </div>

                    <div className={styles.botoes}>
                      {(item.status === "Em Atendimento" ||
                        item.status === "Pedido Pronto" ||
                        item.status === "Em Aberto") && (
                        <button
                          title="Cancelar"
                          className={styles.button}
                          onClick={() => handleOpenModalCancel(item.id)}
                        >
                          <a>
                            <GiCancel size={24} color="#FF3F4B" />
                          </a>
                        </button>
                      )}

                      {(item.status === "Em Atendimento" ||
                        item.status === "Pedido Pronto" ||
                        item.status === "Pedido Finalizado") && (
                        <button
                          id="Detalhes"
                          title="Detalhes"
                          className={styles.button}
                          onClick={() => handleOpenModalView(item.id)}
                        >
                          <a>
                            <FaEye size={24} color="#f7ff85" />
                          </a>
                        </button>
                      )}

                      {item.status === "Em Atendimento" && (
                        <button
                          id="Entregar"
                          title="Entregar"
                          className={styles.button}
                          onClick={() => handleOpenModalTake(item.id)}
                        >
                          <a>
                            <MdLunchDining size={24} color="#d67600" />
                          </a>
                        </button>
                      )}

                      {item.status === "Pedido Pronto" && (
                        <button
                          id="Finalizar"
                          title="Finalizar"
                          className={styles.button}
                          onClick={() => handleOpenModalFinish(item.id)}
                        >
                          <a>
                            <BiSelectMultiple size={24} color="#3fffa3" />
                          </a>
                        </button>
                      )}
                    </div>
                  </div>
                </section>
              );
            })}
          </article>
        </main>

        {modalVisible && modalController === "1" && (
          <ModalOrderDetail
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            order={modalItem}
          />
        )}

        {modalVisible && modalController === "2" && (
          <ModalCancel
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            item={modalOrder}
            handleCancel={handleCancel}
          />
        )}

        {modalVisible && modalController === "3" && (
          <ModalTake
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            item={modalOrder}
            handleTake={handleTake}
          />
        )}

        {modalVisible && modalController === "4" && (
          <ModalFinish
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            item={modalOrder}
            handleFinish={handleFinish}
          />
        )}

        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps = CanSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get("/order/list");
  return {
    props: {
      orders: response.data,
    },
  };
});
