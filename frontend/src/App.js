import GlobalStyle from "./styles/global";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import Form from "./components/Form.js";
import Grid from "./components/Grid";
import Dashboard from "./components/Dashboard.js";
import Entradas from "./components/Entradas.js";
import Saidas from "./components/Saidas";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Import React Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Componente de Rota Protegida
const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [produtos, setProdutos] = useState([]);
  const [onEdit, setOnEdit] = useState(null);
  const [exclusoes, setExclusoes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Verifica se o token está presente no localStorage
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role"); // Recupera o papel do usuário

    if (token && storedRole) {
      setIsAuthenticated(true); // Se o token estiver presente, o usuário está autenticado
      setRole(storedRole); // Define o papel do usuário (por exemplo, 'admin')
    }
  }, []);

  const getExclusoes = async () => {
    try {
      const res = await axios.get("http://localhost:3307/exclusoes");
      setExclusoes(res.data);
    } catch (error) {
      toast.error("Erro ao buscar exclusões");
    }
  };

  useEffect(() => {
    getExclusoes();
  }, []);

  const getProdutos = async () => {
    try {
      const res = await axios.get("http://localhost:3307/");
      setProdutos(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getProdutos();
  }, [setProdutos]);

  return (
    <Router>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Renderiza a Sidebar apenas se o usuário estiver autenticado */}
        {isAuthenticated && <Sidebar />}

        {/* Conteúdo Principal */}
        <Content>
          {/* Definindo as Rotas */}
          <Routes>
            {/* Rota de Inicio */}
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
            />

            {/* Rota da Dashboard */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Rota de Entradas com a lista de produtos */}
            <Route
              path="/entradas"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Entradas produtos={produtos} />
                </PrivateRoute>
              }
            />

            {/* Rota de Saídas com a lista de exclusões */}
            <Route
              path="/saidas"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Saidas exclusoes={exclusoes} />
                </PrivateRoute>
              }
            />

            {/* Rota da Página de Formulário (Cadastro de Produtos) */}
            <Route
              path="/estoque"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Form onEdit={onEdit} setOnEdit={setOnEdit} getProdutos={getProdutos} />
                  <Grid setOnEdit={setOnEdit} produtos={produtos} setProdutos={setProdutos} />
                </PrivateRoute>
              }
            />

            {/* Rota de Login */}
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
            />

            {/* Rota de Registro (Somente para Administradores) */}
            <Route
              path="/register"
              element={
                isAuthenticated && role === "admin" ? (
                  <Register />
                ) : (
                  <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
                )
              }
            />

          </Routes>
        </Content>
      </div>

      {/* Toast de Notificação */}
      <ToastContainer autoClose={3307} position="bottom-left" />
      <GlobalStyle />
    </Router>
  );
}

export default App;
