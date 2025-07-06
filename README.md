# 💻 Express Waiter - Painel Web (Frontend)

Interface web para gerenciamento de pedidos no sistema **Express Waiter**. Essa aplicação permite ao atendente acompanhar pedidos em tempo real, atualizar status, cadastrar produtos, gerar qrcode, gerar relatórios e visualizar detalhes das mesas e clientes.

---

## 📋 Descrição

O painel web do **Express Waiter** foi desenvolvido com **React** e **Next.js**, proporcionando uma experiência moderna e responsiva para o gerenciamento de pedidos em restaurantes.

### Funcionalidades:
- 🧰 Cadastro e gerenciamento de produtos e categorias
- 📦 Listagem de pedidos em tempo real
- 🕒 Atualização de status do pedido: Em Atendimento, Pronto, Finalizado, Cancelado
- 📄 Visualização de detalhes e itens dos pedidos
- 🧾 Geração de relatórios em PDF
- 📶 Integração com WebSocket para notificações instantâneas
- ✅ Feedbacks visuais com `toast`, loaders, tooltips e mensagens condicionais

---

## ⚙️ Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [React.js](https://reactjs.org/)
- [SCSS Modules](https://sass-lang.com/)
- [Axios](https://axios-http.com/)
- [PDFMake](https://pdfmake.github.io/)
- [Socket.IO Client](https://socket.io/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)
- [SweetAlert2](https://sweetalert2.github.io/)

---

## 🛠️ Instalação

```bash
# Clone o repositório (ou vá para a pasta se já estiver no monorepo)
git clone https://github.com/Samuell-Rocha/FrontEnd-ExpressWaiter

# Acesse a pasta do frontend web
cd FrontEnd-ExpressWaiter-main

# Instale as dependências
npm install
```
---

## 🛠️ Como Executar

```bash
# Para executar basta iniciar o servidor frontend:
npm run dev

# Abra o navegador e acesse:
http://localhost:3000
```
---

```markdown
## ℹ️ Observações

- ⚠️ **Antes de utilizar o sistema, é necessário cadastrar um usuário manualmente no banco de dados** (via script SQL ou ferramenta como DBeaver/Beekeeper).
- O servidor backend precisa estar em execução
- O login é realizado com email e senha cadastrados diretamente na tabela de usuários.

