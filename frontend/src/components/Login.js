import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import logo from "../img/Logo.png";


// Componentes estilizados
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'Arial', sans-serif;
`;

const LogoContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4c4b72;
  border-radius: 15px 0px 0px 15px;
  height: 395px;
  box-shadow: 8px 8px 15px 0px rgba(0, 0, 0, 0.2);
`;

const Logo = styled.img`
  width: 200px;
  height: auto;
`;

const Card = styled.div`
  background-color: white;
  padding: 40px 30px;
  border-radius: 0px 15px 15px 0px;;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
  flex: 1;
`;

const Title = styled.h1`
  margin-bottom: 10px;
  color: #2c3e50;
  font-size: 28px;
  font-weight: bold;
`;

const Subtitle = styled.p`
  margin-bottom: 30px;
  color: #7f8c8d;
  font-size: 14px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  max-width: 350px;
  padding: 12px 15px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: box-shadow 0.3s;

  &:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(0, 109, 255, 0.5);
  }
`;

const Button = styled.button`
  width: 100%;
  max-width: 385px;
  padding: 12px;
  background-color: #2c73d2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #1b5fa7;
    transform: scale(1.05);
  }
`;

const Warning = styled.p`
  color: red;
  font-size: 12px;
  margin: -5px 0 15px;
  display: ${(props) => (props.show ? "block" : "none")};
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [capsLockAtivo, setCapsLockAtivo] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      toast.warn("Por favor, preencha todos os campos!");
      return;
    }
  
    try {
      const res = await axios.post("http://localhost:3307/login", { email, senha });
      
      // Logando a resposta para verificar os dados retornados pela API
      console.log(res.data);  // Verifique o que está sendo retornado pelo servidor
  
      if (res.data.token && res.data.role) {
        const { token, role } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role); // Salvar a role também
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
        setTimeout(() => {
          window.location.reload();
        }, 1);
      } else {
        toast.error("Login falhou. Verifique suas credenciais.");
      }
    } catch (err) {
      const errorMessage =
        err.response && err.response.data ? err.response.data : "Erro ao conectar ao servidor.";
      toast.error(errorMessage);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleKeyUp = (e) => {
    setCapsLockAtivo(e.getModifierState("CapsLock"));
  };

  return (
    <Container>
      <LogoContainer>
        <Logo src={logo} alt="Logo" />
      </LogoContainer>
      <Card>
        <Title>Bem-vindo!</Title>
        <Subtitle>Entre com suas credenciais para acessar o sistema</Subtitle>
        <Form>
          <Input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          />
        </Form>
        <Warning show={capsLockAtivo}>⚠️ O Caps Lock está ativado!</Warning>
        <Button onClick={handleLogin}>Entrar</Button>
      </Card>
    </Container>
  );
};

export default LoginPage;
