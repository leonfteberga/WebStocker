import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Dropdown from "../components/Dropdown";
import SearchBar from "../components/SearchBar";

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

const Table = styled.table`
  width: 100%;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-width: 1120px;
  margin: 20px auto;
  word-break: break-all;
  table-layout: fixed; 
  border-collapse: collapse; 
`;

export const Thead = styled.thead``;
export const Tbody = styled.tbody``;
export const Tr = styled.tr`
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #f1f1f1;
  }
`;

export const Th = styled.th`
  text-align: start;
  padding: 12px;
  cursor: pointer;
  font-weight: bold;
  color: #444;
  background-color: #f9f9f9;
  border-bottom: 2px solid #e1e1e1;
  &:hover {
    background-color: #e9e9e9;
  }
`;

export const Td = styled.td`
  padding: 12px;
  text-align: ${(props) => (props.alignCenter ? "center" : "start")};
  width: 50%;
  color: #555;
`;

const Saidas = () => {
  const [exclusoes, setExclusoes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(""); 
  const [sortDirection, setSortDirection] = useState("asc"); 

  const fetchExclusoes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3307/exclusoes");
      setExclusoes(response.data);
    } catch (error) {
      console.error("Erro ao buscar exclusões:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExclusoes();
  }, []);

  const normalizeString = (str) => (str ? String(str).toLowerCase() : "");

  const filteredExclusoes = exclusoes.filter((exclusao) => {
    return (
      normalizeString(exclusao.nome_produto).includes(normalizeString(searchTerm)) ||
      normalizeString(exclusao.data_exclusao).includes(normalizeString(searchTerm))
    );
  });

  const sortExclusoes = (field) => {
    const sorted = [...filteredExclusoes].sort((a, b) => {
      if (field === "nome_produto") {
        const nameA = a.nome_produto.toLowerCase();
        const nameB = b.nome_produto.toLowerCase();
        return sortDirection === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      } else if (field === "data_exclusao") {
        const dateA = new Date(a.data_exclusao);
        const dateB = new Date(b.data_exclusao);
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
    return sorted;
  };


  const toggleSortDirection = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const clearSearch = () => setSearchTerm("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      <Navbar>
        <h2>Saídas de Produtos</h2>
        <Dropdown onLogout={handleLogout} />
      </Navbar>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        onClear={clearSearch}
      />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th onClick={() => toggleSortDirection("nome_produto")}>
                Nome do Produto
                <span>{sortBy === "nome_produto" ? (sortDirection === "asc" ? " ↑" : " ↓") : " ↑↓"}</span>
              </Th>
              <Th onClick={() => toggleSortDirection("data_exclusao")}>
                Data da Saída
                <span>{sortBy === "data_exclusao" ? (sortDirection === "asc" ? " ↑" : " ↓") : " ↑↓"}</span>
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {filteredExclusoes.length > 0 ? (
              sortExclusoes(sortBy).map((item, i) => (
                <Tr key={i}>
                  <Td>{item.nome_produto}</Td>
                  <Td>{new Date(item.data_exclusao).toLocaleString() || "Data não disponível"}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>
                  Nenhuma exclusão encontrada
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      )}
    </>
  );
};

export default Saidas;
