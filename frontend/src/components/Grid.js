import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import SearchBar from "../components/SearchBar"; 

const Table = styled.table`
  width: 100%;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-width: 1120px;
  margin: 20px auto;
  word-break: break-all;
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
  width: ${(props) => (props.width ? props.width : "auto")};
  color: #555;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => (props.delete ? "#ff4d4d" : "#4d4dff")};
  font-size: 18px;
  transition: color 0.3s ease;

  &:hover {
    color: ${(props) => (props.delete ? "#ff1a1a" : "#1a1aff")};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) => (props.confirm ? "#4CAF50" : "#F44336")};
  color: white;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.confirm ? "#45a049" : "#e32f2f")};
  }
`;

const Grid = ({ produtos, setProdutos, setOnEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleEdit = (item) => {
    setOnEdit(item);
  };

  const openModal = (id) => {
    setProductToDelete(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete("http://localhost:3307/" + productToDelete);
      const newArray = produtos.filter((produto) => produto.id !== productToDelete);
      setProdutos(newArray);
      toast.success(data);
      closeModal();
    } catch (error) {
      toast.error("Erro ao deletar o produto. Por favor, tente novamente.");
    }
  };

  const normalizeString = (str) => (str ? String(str).toLowerCase() : "");

  const filteredProdutos = produtos.filter((produto) => {
    return normalizeString(produto.nome).includes(normalizeString(searchTerm));
  });

  const sortProdutos = (field) => {
    const sorted = [...filteredProdutos].sort((a, b) => {
      if (field === "nome") {
        const nameA = a.nome.toLowerCase();
        const nameB = b.nome.toLowerCase();
        return sortDirection === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (field === "preco") {
        return sortDirection === "asc" ? a.preco - b.preco : b.preco - a.preco;
      } else if (field === "status") {
        const statusA = a.status.toLowerCase();
        const statusB = b.status.toLowerCase();
        return sortDirection === "asc"
          ? statusA.localeCompare(statusB)
          : statusB.localeCompare(statusA);
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

  const formatPrice = (price) => `R$ ${parseFloat(price).toFixed(2)}`;

  return (
    <>
      <SearchBar
        value={searchTerm} 
        onChange={setSearchTerm} 
        onClear={() => setSearchTerm("")} 
      />

      <Table>
        <Thead>
          <Tr>
            <Th onClick={() => toggleSortDirection("nome")}>
              Nome
              <span>{sortBy === "nome" ? (sortDirection === "asc" ? " ↑" : " ↓") : " ↑↓"}</span>
            </Th>
            <Th onClick={() => toggleSortDirection("quantidade")}>
              Quantidade
            </Th>
            <Th onClick={() => toggleSortDirection("categoria")}>
              Categoria
            </Th>
            <Th onClick={() => toggleSortDirection("preco")}>
              Preço
              <span>{sortBy === "preco" ? (sortDirection === "asc" ? " ↑" : " ↓") : " ↑↓"}</span>
            </Th>
            <Th onClick={() => toggleSortDirection("status")}>
              Status
              <span>{sortBy === "status" ? (sortDirection === "asc" ? " ↑" : " ↓") : " ↑↓"}</span>
            </Th>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortProdutos(sortBy).map((item, i) => (
            <Tr key={i}>
              <Td width="20%">{item.nome}</Td>
              <Td width="20%">{item.quantidade}</Td>
              <Td width="20%">{item.categoria}</Td>
              <Td width="20%">{formatPrice(item.preco)}</Td>
              <Td width="20%">{item.status}</Td>
              <Td alignCenter width="5%">
                <ActionButton onClick={() => handleEdit(item)} title="Editar Produto">
                  <FaEdit />
                </ActionButton>
              </Td>
              <Td alignCenter width="5%">
                <ActionButton delete onClick={() => openModal(item.id)} title="Excluir Produto">
                  <FaTrash />
                </ActionButton>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <ModalOverlay show={showModal}>
        <ModalContent>
          <h3>Tem certeza de que deseja excluir este produto?</h3>
          <ModalButton confirm onClick={handleDelete}>Sim, Excluir</ModalButton>
          <ModalButton onClick={closeModal}>Cancelar</ModalButton>
        </ModalContent>
      </ModalOverlay>
    </>
  );
};

export default Grid;
