import { useContext } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";

import { FiLogOut } from "react-icons/fi";

import { AuthContext } from "@/contexts/AuthContext";

export function Header() {
  const { signOut } = useContext(AuthContext);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/dashboard" legacyBehavior>
          <img src="/ExpressWaiterMenu.png" />
        </Link>

        <nav className={styles.menuNav}>
          <div>
            <Link href="/table" legacyBehavior>
              <a>Mesas</a>
            </Link>
          </div>

          <div>
            <Link href="/category" legacyBehavior>
              <a>Categorias</a>
            </Link>
          </div>

          <div>
            <Link href="/product" legacyBehavior>
              <a>Produtos</a>
            </Link>
          </div>

          <div>
            <Link href="/order" legacyBehavior>
              <a>Pedidos</a>
            </Link>
          </div>

          <div>
            <Link href="/users" legacyBehavior>
              <a>Usuarios</a>
            </Link>
          </div>

          <button onClick={signOut}>
            <FiLogOut color="#ff3f4b" size={24} />
          </button>
        </nav>
      </div>
    </header>
  );
}
