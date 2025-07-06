import Modal from "react-modal";
import styles from "./style.module.scss";

//icone fechar
import { FiTrash, FiX } from "react-icons/fi";
import { BsFillStarFill } from "react-icons/bs";

import { OrderItemProps } from "@/pages/order";
import { useState } from "react";
import { ModalDelete } from "@/components/ui/ModalDelete";
import { setupAPIClient } from "@/services/api";
import { toast } from "react-toastify";

interface ModalOrderProps {
  isOpen: boolean;
  onRequestClose: () => void;
  order: OrderItemProps[];
}

export function ModalOrderDetail({
  isOpen,
  onRequestClose,
  order,
}: ModalOrderProps) {
  const customStyles = {
    content: {
      top: "50%",
      bottom: "auto",
      left: "50%",
      right: "auto",
      padding: "30px",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#1d1d2e",
      height: "auto",
    },
  };
  const [orderList, setorderList] = useState(order || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalOrder, setModalOrder] = useState<OrderItemProps[]>();

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleOpenModalView(item_id: string) {
    const apiClient = setupAPIClient();
    

    const response = await apiClient.get("/order/list/item", {
      params: {
        item_id: item_id,
      },
    });

    setModalOrder(response.data);
    setModalVisible(true);
  }

  async function handleDelete(id: string) {
    const apiClient = setupAPIClient();

    try {
      await apiClient.delete("/order/remove", {
        params: {
          item_id: id,
        },
      });

      const response = await apiClient.get("/order/list/item",{
        params:{
          order_id: order[0].order_id
        }
      });
      setorderList(response.data);
      setModalVisible(false);

      toast.success("item deletado com sucesso");
    } catch {
      toast.error("erro");
    }
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <button
        type="button"
        onClick={onRequestClose}
        className="react-modal-close"
        style={{ background: "transparent", border: 0 }}
      >
        <FiX size={45} color="#f34748" />
      </button>
      <div className={styles.container}>
        <h2>Detalhes do pedido</h2>

        <span className={styles.table}>Mesa: {order[0].order.table_id} </span>
        <br />

        {orderList.map((item) => (
          <section key={item.id} className={styles.containerItem}>
            <div className={styles.content}>
              {" "}
              <span>
                {item.amount} <strong>{item.product.name}</strong>
              </span>
              <span className={styles.description}>
                {item.product.description}
              </span>{" "}
              <span>
                Tempo de Preparo -{" "}
                <strong>{order[0].product.estimated_time}</strong>
              </span>
            </div>
            {(order[0].order.status === "Em Atendimento" ||
              order[0].order.status === "Pedido Pronto") && (
              <button
                title="Deletar"
                className={styles.button}
                onClick={() => handleOpenModalView(item.id)}
              >
                <a>
                  <FiTrash size={24} color="#FF3F4B" />
                </a>
              </button>
            )}
          </section>
        ))}

        <div>
          {order[0].order.Rating[0]?.id && (
            <table className={styles.rating}>
              <thead className={styles.thead}>
                <tr>
                  <th colSpan={2}>Avaliação</th>
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                <tr>
                  <td>Ambiente</td>
                  <td>
                    {order[0].order.Rating[0].establishment} Estrelas{" "}
                    <BsFillStarFill size={20} color="#ffd112" />
                  </td>
                </tr>
                <tr>
                  <td>Comida</td>
                  <td>
                    {order[0].order.Rating[0].food} Estrelas{" "}
                    <BsFillStarFill size={20} color="#ffd112" />
                  </td>
                </tr>
                <tr>
                  <td>Preço</td>
                  <td>
                    {order[0].order.Rating[0].service} Estrelas{" "}
                    <BsFillStarFill size={20} color="#ffd112" />
                  </td>
                </tr>
                <tr>
                  <td>Tempo de espera</td>
                  <td>
                    {order[0].order.Rating[0].waitingtime} Estrelas{" "}
                    <BsFillStarFill size={20} color="#ffd112" />
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
      {modalVisible && (
        <ModalDelete
          isOpen={modalVisible}
          onRequestClose={handleCloseModal}
          item={modalOrder}
          handleDelete={handleDelete}
        />
      )}
    </Modal>
  );
}
