import React, { useState } from "react";
import styles from "./style.module.scss";

import { ItemProductProps } from "@/pages/product";
import { setupAPIClient } from "@/services/api";

export function ToggleSwitch({ id, active }) {
  const [isChecked, setChecked] = useState(false);
  const apiClient = setupAPIClient();

  const handlecheck = async () => {
    if (active === false) {
      const response = await apiClient.put("/product", {
        id: id,
        active: "true",
        stock: "true"
      });

    } else if(active === true) {
      const response = await apiClient.put("/product", {
        id: id,
        active: "false",
        stock: "true"
      });
    }
    
  };

  return (
    <div className={styles.container}>
      <input
        id={id}
        defaultChecked={active}
        className={styles.input}
        onClick={handlecheck}
        type="checkbox"
      />
      <label htmlFor={id}></label>
    </div>
  );
}
