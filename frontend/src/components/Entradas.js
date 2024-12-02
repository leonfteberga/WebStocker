import React, { useState } from "react";
import styled from "styled-components";
import Dropdown from "../components/Dropdown";
import SearchBar from "../components/SearchBar";

// Estilização para a barra de navegação
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

const Table = styled.table`
  width: 100%;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-width: 1120px;
  margin: 20px auto;
  word-break: break-all;
  table-layout: fixed; // Garante que as colunas fiquem alinhadas
  border-collapse: collapse; // Elimina as bordas duplas
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

const Entradas = ({ produtos = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(""); // Estado para determinar a coluna a ser ordenada
  const [sortDirection, setSortDirection] = useState("asc"); // Estado para controlar a direção da ordenação (ascendente ou descendente)

  const normalizeString = (str) => (str ? String(str).toLowerCase() : "");

  const filteredProdutos = produtos.filter((produto) => {
    return normalizeString(produto.nome).includes(normalizeString(searchTerm));
  });

  // Função para ordenar os produtos
  const sortProdutos = (field) => {
    const sorted = [...filteredProdutos].sort((a, b) => {
      if (field === "nome") {
        const nameA = a.nome.toLowerCase();
        const nameB = b.nome.toLowerCase();
        return sortDirection === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (field === "created_at") {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
    return sorted;
  };

  // Função para alternar a direção da ordenação
  const toggleSortDirection = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // Função para limpar a busca
  const clearSearch = () => setSearchTerm("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      <Navbar>
        <h2>Entrada de Produtos</h2>
        <Dropdown onLogout={handleLogout} />
      </Navbar>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        onClear={clearSearch}
      />

      <Table>
        <Thead>
          <Tr>
            <Th onClick={() => toggleSortDirection("nome")}>
              Nome do Produto
              <span>{sortBy === "nome" ? (sortDirection === "asc" ? " ↑" : " ↓") : " ↑↓"}</span>
            </Th>
            <Th onClick={() => toggleSortDirection("created_at")}>
              Data de Criação
              <span>{sortBy === "created_at" ? (sortDirection === "asc" ? " ↑" : " ↓") : " ↑↓"}</span>
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {sortProdutos(sortBy).map((item, i) => (
            <Tr key={i}>
              <Td>{item.nome}</Td>
              <Td>
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : "Data não disponível"}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default Entradas;
