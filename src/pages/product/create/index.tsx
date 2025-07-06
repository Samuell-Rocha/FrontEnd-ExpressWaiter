import Head from "next/head";
import { Footer } from "@/components/ui/Footer";
import styles from "./styles.module.scss";
import { CanSSRAuth } from "@/utils/CanSSRAuth";
import { Header } from "@/components/ui/Header";
import { setupAPIClient } from "@/services/api";
import { toast } from "react-toastify";
import { ChangeEvent, FormEvent, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { type } from "os";
import { io } from "socket.io-client"; 


type ItemProps = {
  id: string;
  name: string;
};

interface CategoryProps {
  categoryList: ItemProps[];
}

type ItemUser = {
  id: string;
  name: string;
  email: string;
  userAccess: {
    Access: {
      name: string;
    };
  };
};

interface user {
  users: ItemUser[];
}

const socket = io('http://192.168.1.18:8081')
socket.on('connect', () => console.log('[IO] Connect => A new connection has been established'))

export default function Product(
  { users }: user,
  { categoryList }: CategoryProps
) {
  const apiClient = setupAPIClient();
  const responseList = apiClient.get("/listcategory");

  Promise.resolve(responseList).then(function (value) {
    setCategories(value.data);
  });



  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [estimated_time, setestimated_Time] = useState("");

  const [avatarUrl, setavatarUrl] = useState("");
  const [imageAvatar, setImageAvatar] = useState(null);

  const [categories, setCategories] = useState(categoryList || []);
  const [categorySelected, setCategorySelected] = useState(0);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      toast.warning("Preencha todos os campos");
      return;
    }

    const image = e.target.files[0];

    if (!image) {
      return;
    }

    if (
      image.type === "image/jpeg" ||
      image.type === "image/png" ||
      image.type === "image/jpg"
    ) {
      setImageAvatar(image);
      setavatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  }

  //quando seleciona uma nova categoria na lista
  function handleChangeCategory(event) {
    setCategorySelected(event.target.value);
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    //socket.emit("produto.cadastro", "nao sei se e obrigado" )



    try {
      const data = new FormData();

      if (name === "" || price == "" || imageAvatar === null) {
        toast.warning("Preencha todos os campos");
        return;
      }

      data.append("name", name);
      data.append("price", price);
      data.append("description", description);
      data.append("estimated_time", estimated_time);
      data.append("category_id", categories[categorySelected].id);
      data.append("file", imageAvatar);

      const apiClient = setupAPIClient();
      await apiClient.post("/product", data);

      toast.success("Produto cadastrado com sucesso");

   
    } catch (error) {
      toast.error("Erro ao cadastrar");
    }

    setName("");
    setPrice("");
    setDescription("");
    setImageAvatar(null);
    setavatarUrl("");
    setestimated_Time("");
  }

  if (users) {
    return (
      <>
        <Head>
          <title>Novo Produtos - Express Waiter</title>
        </Head>

        <div>
          <Header />

          <main className={styles.container}>
            <h1>Novo Produto</h1>

            <form className={styles.form} onSubmit={handleRegister}>
              <label className={styles.labelAvatar}>
                <span>
                  <strong>Foto Produto</strong>
                  <FiUpload className={styles.icon} size={30} color="#FFF" />
                </span>

                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFile}
                />

                {avatarUrl && (
                  <img
                    className={styles.preview}
                    src={avatarUrl}
                    alt="Foto do produto"
                    width={250}
                    height={250}
                  />
                )}
              </label>

              <select value={categorySelected} onChange={handleChangeCategory}>
                {categories.map((item, index) => {
                  return (
                    <option key={item.id} value={index}>
                      {item.name}
                    </option>
                  );
                })}
              </select>

              <input
                type="text"
                placeholder="Nome do item"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <textarea
                placeholder="Descricao"
                className={styles.input}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="number"
                step={0.01}
                placeholder="Preço"
                className={styles.input}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <input
                type="time"
                placeholder="Tempo estimado de preparo"
                className={styles.input}
                value={estimated_time}
                onChange={(e) => setestimated_Time(e.target.value)}
              />

              <button className={styles.buttonAdd} type="submit">
                Cadastrar
              </button>
            </form>
          </main>
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

  const responseUser = await apiClient.get("/users/list").catch((error) => {
    if (error.response) {
      return error.response;
    }
  });

  const responseList = await apiClient.get("/listcategory");

  return {
    props: {
      users: responseUser.data,
      categoryList: responseList.data,
    },
  };
});
