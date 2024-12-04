import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Dropdown from "../components/Dropdown";

const Navbar = styled.nav`
  width: 90vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4c4b72; // Cor mais suave
  padding: 30px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  text-align: left;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

// Estilização dos elementos
const FormContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 40px auto;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const FormTitle = styled.h1`
  text-align: center;
  font-size: 24px;
  color: #4c4b72;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4c4b72;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #4c4b72;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3c3a5a;
  }

  &:disabled {
    background-color: #a3a3a3;
    cursor: not-allowed;
  }
`;

const Register = () => {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (token && storedRole) {
      setIsAuthenticated(true);
      setIsAdmin(storedRole === "admin");
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };
  
  const handleRegister = async () => {
    if (!email || !senha || !role) {
      toast.warn("Por favor, preencha todos os campos!");
      return;
    }
  
    if (!validatePassword(senha)) {
      toast.warn("A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, um número e um caractere especial.");
      return;
    }
  
    setIsSubmitting(true); 
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3307/register",
        { usuario, email, senha, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message || "Usuário cadastrado com sucesso!");
      setUsuario("");
      setEmail("");
      setSenha("");
      setRole("");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.response?.data?.message || "Erro ao cadastrar usuário.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false); 
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      <Navbar>
        <h2>Cadastro de Usuários</h2>
        <Dropdown onLogout={handleLogout} />
      </Navbar>

      <FormContainer>
        <FormTitle>Cadastro de Usuários</FormTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <Input
            type="text"
            placeholder="Digite o nome de usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Digite o e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Digite a senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Selecione a função</option>
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </Select>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processando..." : "Cadastrar"}
          </Button>
        </form>
      </FormContainer>
    </>
  );
};

export default Register;
