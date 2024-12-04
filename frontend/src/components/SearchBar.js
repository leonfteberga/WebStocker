// src/components/SearchBar.js
import React, { useState } from "react";
import styled from "styled-components";

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
  width: 68%;
`;

const SearchInput = styled.input`
  padding: 10px;
  width: 80%; 
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px; 
  margin-right: 10px;
`;

const ClearButton = styled.button`
  padding: 10px;
  width: 10%; 
  border: none;
  background-color: #ff4d4d;
  color: white;
  border-radius: 0 5px 5px 0; 
  cursor: pointer;

  &:hover {
    background-color: #ff1a1a;
  }
`;

const SearchBar = ({ value, onChange, onClear }) => {
  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Faça Sua Busca Aqui!"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <ClearButton onClick={onClear}>Limpar Busca</ClearButton>
    </SearchContainer>
  );
};

export default SearchBar;
