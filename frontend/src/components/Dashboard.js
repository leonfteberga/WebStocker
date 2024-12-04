import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaCheckCircle, FaTimesCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/Dropdown";

const Navbar = styled.nav`
  width: 90vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4c4b72; 
  padding: 30px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  text-align: left;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;


const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  padding-top: 60px;
`;


const DashboardContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 30px;
  background-color: #f7f9fc;
  border-radius: 15px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 30px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  }
`;


const StatCardsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const StatCard = styled.div`
  flex: 1;
  min-width: 250px;
  max-width: 320px;  
  padding: 25px;
  background-color: ${(props) => (props.available ? "#d1f7c4" : "#f7c4c4")};
  border-radius: 8px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  }
`;


const IconTextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  font-size: 1.3em;
  margin-bottom: 10px;
`;

const StatNumber = styled.p`
  font-size: 1.4em;
  font-weight: bold;
  color: #333;
`;

const LoadingMessage = styled.p`
  font-size: 18px;
  color: #888;
`;

const ErrorMessage = styled.p`
  font-size: 18px;
  color: red;
  margin-bottom: 10px;
`;

const RefreshButton = styled.button`
  padding: 12px 20px;
  background-color: #595988;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #4d4d75;
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [disponiveis, setDisponiveis] = useState(null);
  const [indisponiveis, setIndisponiveis] = useState(null);
  const [somaPrecos, setSomaPrecos] = useState(null);
  const [totalQuantidade, setTotalQuantidade] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [contagemRes, somaRes, quantidadeRes] = await Promise.all([
        axios.get("http://localhost:3307/contagem"),
        axios.get("http://localhost:3307/produtos/soma-precos-disponiveis"),
        axios.get("http://localhost:3307/produtos/quantidade-total"), 
      ]);

      // Log das respostas da API
      console.log("Resposta da API:", {
        contagem: contagemRes.data,
        somaPrecos: somaRes.data,
        totalQuantidade: quantidadeRes.data,
      });

      setDisponiveis(contagemRes.data.disponiveis ?? 0);
      setIndisponiveis(contagemRes.data.indisponiveis ?? 0);
      setSomaPrecos(somaRes.data.totalPrecos ?? 0);
      setTotalQuantidade(quantidadeRes.data.totalQuantidades ?? 0); 
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <Navbar>
        <h2>Dashboard de Produtos</h2>
        <Dropdown onLogout={handleLogout} />
      </Navbar>

      <PageContainer>
        <DashboardContainer>
          {loading ? (
            <LoadingMessage>Carregando dados...</LoadingMessage>
          ) : error ? (
            <>
              <ErrorMessage>Erro ao carregar dados. Verifique sua conexão e tente novamente.</ErrorMessage>
              <RefreshButton onClick={fetchData}>Tentar Novamente</RefreshButton>
            </>
          ) : (
            <StatCardsContainer>
              <StatCard available>
                <IconTextContainer>
                  <FaCheckCircle size={30} color="#4CAF50" />
                  <h3>Grupos Disponíveis</h3>
                </IconTextContainer>
                <StatNumber>{disponiveis !== null ? disponiveis : "Dados não disponíveis"}</StatNumber>
              </StatCard>

              <StatCard>
                <IconTextContainer>
                  <FaTimesCircle size={30} color="#F44336" />
                  <h3>Grupos Indisponíveis</h3>
                </IconTextContainer>
                <StatNumber>{indisponiveis !== null ? indisponiveis : "Dados não disponíveis"}</StatNumber>
              </StatCard>

              <StatCard style={{ backgroundColor: "#cfe8fc" }}> {/* Azul suave */}
                <IconTextContainer>
                  <FaCheckCircle size={30} color="#2196F3" />
                  <h3>Soma dos Preços</h3>
                </IconTextContainer>
                <StatNumber>
                  {somaPrecos !== null
                    ? `R$ ${somaPrecos.toFixed(2)}`
                    : "Dados não disponíveis"}
                </StatNumber>
              </StatCard>

              <StatCard style={{ backgroundColor: "#cfe8fc" }}> 
                <IconTextContainer>
                  <FaCheckCircle size={30} color="#2196F3" />
                  <h3>Total de Produtos</h3>
                </IconTextContainer>
                <StatNumber>
                  {totalQuantidade !== null && totalQuantidade !== undefined
                    ? `${totalQuantidade}` 
                    : "Dados não disponíveis"}
                </StatNumber>
              </StatCard>

            </StatCardsContainer>
          )}
        </DashboardContainer>
      </PageContainer>
    </>
  );
};

export default Dashboard;
