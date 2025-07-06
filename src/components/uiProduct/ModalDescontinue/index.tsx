import Modal from "react-modal";
import styles from "./style.module.scss";

//icone fechar
import { FiX } from "react-icons/fi";

import { ItemProductProps } from "@/pages/product";
import { CategoryProps } from "@/pages/category";
import { TableProps } from "@/pages/table";
import { OrderProps } from "@/pages/order";
import { isTypeNode } from "typescript";

interface ModalDescontinueProps {
  isOpen: boolean;
  onRequestClose: () => void;
  item: ItemProductProps[] | CategoryProps[] | TableProps[] | OrderProps[];
  handleDescontinue: (id: string | number) => void;
}

export function ModalDescontinue({
  isOpen,
  onRequestClose,
  item,
  handleDescontinue,
}: ModalDescontinueProps) {
  const customStyles = {
    content: {
      top: "50%",
      bottom: "auto",
      left: "50%",
      right: "auto",
      padding: "30px",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#1d1d2e",
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <button
        type="button"
        onClick={onRequestClose}
        className="react-modal-close"
        style={{ background: "transparent", border: 0 }}
      >
        <FiX size={45} color="#f34748" />
      </button>
      <div className={styles.container}>
        <h2>Você tem certeza que deseja descontinuar este item?</h2>

        <button
          className={styles.button}
          onClick={() => handleDescontinue(item[0].id)}
        >
          Sim
        </button>
      </div>
    </Modal>
  );
}
