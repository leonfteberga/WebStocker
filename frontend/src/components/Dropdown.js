import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaUser, FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 65px;
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;

  &:hover {
    color: #1a1b41;
  }
`;

const DropdownMenu = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  right: 10px; 
  background-color: #1a1b41;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  min-width: 160px;
  border-radius: 5px;
  top: 40px;
`;

const DropdownItem = styled.button`
  background-color: #1a1b41;
  color: white;
  border: none;
  padding: 12px 16px;
  width: 100%;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #121440;
  }
`;

const Dropdown = ({ onLogout }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleGoToRegister = () => {
    navigate("/register"); 
  };

  return (
    <DropdownContainer>
      <DropdownButton onClick={toggleDropdown}>
        <FaUser />
      </DropdownButton>
      <DropdownMenu isOpen={isDropdownOpen}>
        {isAdmin && (
          <DropdownItem onClick={handleGoToRegister}>
            <FaUserPlus style={{ marginRight: "8px" }} />
            Registrar
          </DropdownItem>
        )}
        <DropdownItem onClick={onLogout}>
          <FaSignOutAlt style={{ marginRight: "8px" }} />
          Sair
        </DropdownItem>
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default Dropdown;
