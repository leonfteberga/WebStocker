import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import Dropdown from "../components/Dropdown";

// Overlay com efeito suave
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: ${(props) => (props.show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 999;
  opacity: ${(props) => (props.show ? "1" : "0")};
  transition: opacity 0.3s ease-in-out;
`;

// Navbar com novo design e sombra sutil
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

const Card = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
  z-index: 1000;
  animation: fadeIn 0.5s ease;
  
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(-30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ToggleButton = styled.button`
  background-color: #595988; 
  color: #fff;
  padding: 14px 30px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin: 20px auto;
  display: ${(props) => (props.show ? "none" : "block")};
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #4d4d8a; 
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const InputArea = styled.div`
  width: 100%;
  text-align: left;
`;

const Input = styled.input`
  width: 95%; 
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  transition: border 0.3s ease;
  
  &:focus {
    border-color: #5c4d7d;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  transition: border 0.3s ease;
  
  &:focus {
    border-color: #5c4d7d;
  }
`;

const Label = styled.label`
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
  font-weight: bold;
`;

const Button = styled.button`
  padding: 14px 24px;
  cursor: pointer;
  border-radius: 8px;
  border: none;
  background-color: #8a7fbb;
  color: white;
  font-size: 16px;
  width: 100%;
  transition: background-color 0.3s;
  margin-top: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #6d61a2;
  }
`;

const CancelButton = styled.button`
  padding: 14px 24px;
  cursor: pointer;
  border-radius: 8px;
  background: none;
  border: 2px solid #ff6666;
  color: #ff6666;
  width: 100%;
  font-size: 16px;
  transition: background-color 0.3s;
  margin-top: 10px;
  
  &:hover {
    background-color: rgba(255, 102, 102, 0.1);
  }
`;

const Form = ({ getProdutos, onEdit, setOnEdit }) => {
  const ref = useRef();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (onEdit) {
      setShowForm(true);
      preencherCampos(onEdit);
    } else {
      limparCampos();
    }
  }, [onEdit]);

  const preencherCampos = (produto) => {
    const produtos = ref.current;
    if (produtos) {
      produtos.nome.value = produto.nome || "";
      produtos.quantidade.value = produto.quantidade || "";
      produtos.categoria.value = produto.categoria || "";
      produtos.preco.value = produto.preco || "";
      produtos.status.value = produto.status || "disponivel";
    }
  };

  const limparCampos = () => {
    const produtos = ref.current;
    if (produtos) {
      produtos.nome.value = "";
      produtos.quantidade.value = "";
      produtos.categoria.value = "";
      produtos.preco.value = "";
      produtos.status.value = "disponivel";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const produtos = ref.current;

    if (
      !produtos.nome.value ||
      !produtos.quantidade.value ||
      !produtos.categoria.value ||
      !produtos.preco.value ||
      !produtos.status.value
    ) {
      return toast.warn("Por favor, preencha todos os campos.");
    }

    try {
      const request = onEdit
        ? axios.put("http://localhost:3307/" + onEdit.id, {
            nome: produtos.nome.value,
            quantidade: produtos.quantidade.value,
            categoria: produtos.categoria.value,
            preco: produtos.preco.value,
            status: produtos.status.value,
          })
        : axios.post("http://localhost:3307", {
            nome: produtos.nome.value,
            quantidade: produtos.quantidade.value,
            categoria: produtos.categoria.value,
            preco: produtos.preco.value,
            status: produtos.status.value,
          });

      await request;
      toast.success("Produto salvo com sucesso!");
      getProdutos();
      fecharFormulario();
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar o produto.");
    }
  };

  const fecharFormulario = () => {
    limparCampos();
    setShowForm(false);
    setOnEdit(null);
  };

  return (
    <>
      <Navbar>
        <h2>Estoque de Produtos</h2>
        <Dropdown onLogout={() => localStorage.removeItem("token")} />
      </Navbar>

      <ToggleButton
        show={showForm}
        onClick={() => {
          setOnEdit(null);
          limparCampos();
          setShowForm(true);
        }}
      >
        <FaPlus /> Cadastrar Produto
      </ToggleButton>

      <Overlay show={showForm}>
        <Card>
          <h2>{onEdit ? "Editar Produto" : "Cadastrar Produto"}</h2>
          <FormContainer ref={ref} onSubmit={handleSubmit}>
            <InputArea>
              <Label>Nome *</Label>
              <Input name="nome" />
            </InputArea>
            <InputArea>
              <Label>quantidade *</Label>
              <Input name="quantidade" type="number" />
            </InputArea>
            <InputArea>
              <Label>Categoria *</Label>
              <Input name="categoria" />
            </InputArea>
            <InputArea>
              <Label>Preço (R$) *</Label>
              <Input name="preco" type="number" />
            </InputArea>
            <InputArea>
              <Label>Status *</Label>
              <Select name="status">
                <option value="disponivel">Disponível</option>
                <option value="indisponivel">Indisponível</option>
              </Select>
            </InputArea>

            <Button type="submit">Salvar</Button>
            <CancelButton type="button" onClick={fecharFormulario}>
              Cancelar
            </CancelButton>
          </FormContainer>
        </Card>
      </Overlay>
    </>
  );
};

export default Form;
