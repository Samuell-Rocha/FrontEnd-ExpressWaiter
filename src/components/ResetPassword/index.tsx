import Modal from "react-modal";
import styles from "./style.module.scss";

//icone fechar
import { FiX } from "react-icons/fi";
import { BsFillStarFill } from "react-icons/bs";

import { OrderItemProps } from "@/pages/order";
import { useState } from "react";
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import { setupAPIClient } from "@/services/api";
import { UserProps } from "@/pages/users";

interface ModalResetPassword {
  isOpen: boolean;
  onRequestClose: () => void;
  item: UserProps[];
}

export function ModalResetPassword({
  isOpen,
  onRequestClose,
  item,
}: ModalResetPassword) {
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

  const [password, setPassword] = useState("");

  async function resetPassword(item: string) {
    if (password === "") {
      toast.warning("Preencha todos os campos");
      return;
    }

    try {
      const apiClient = setupAPIClient();
      await apiClient.put("/users/password", {
        email: item,
        password: password,
      });

      toast.success("senha resetada com sucesso");
      setPassword("");
    } catch (error) {
      toast.error("Erro");
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
        <h2>Resetar Senha</h2>

        <Input
          placeholder="Digite sua senha"
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className={styles.button}
          onClick={() => resetPassword(item[0].email)}
        >
          Resetar
        </button>
      </div>
    </Modal>
  );
}
