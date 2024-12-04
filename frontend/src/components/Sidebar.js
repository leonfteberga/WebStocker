import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaThLarge, FaBoxOpen, FaArrowRight, FaArrowLeft, FaBars } from "react-icons/fa";
import styled from "styled-components";
import logo from "../img/Logo.png";

const SidebarContainer = styled.div`
  width: ${(props) => (props.collapsed ? "80px" : "250px")};
  height: 95.6vh;
  background: linear-gradient(145deg, #1a1b41, #2a2b5f);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  position: relative;
`;

const LogoContainer = styled.div`
  margin-bottom: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Logo = styled.img`
  width: ${(props) => (props.collapsed ? "40px" : "160px")};
  height: auto;
  transition: width 0.3s ease;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

const NavItem = styled.li`
  margin-bottom: 50px;
  text-align: center;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: ${(props) => (props.hover ? "#2a2b5f" : "transparent")};

  &:hover {
    background: #2a2b5f;
    transform: translateX(5px);
  }
`;

const NavIcon = styled.div`
  margin-right: ${(props) => (props.collapsed ? "0" : "10px")};
  font-size: 24px;
  transition: margin-right 0.3s ease;
`;

const NavText = styled.span`
  display: ${(props) => (props.collapsed ? "none" : "inline")};
  font-size: 16px;
  transition: opacity 0.3s ease;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 20px;
  right: ${(props) => (props.collapsed ? "-30px" : "-60px")};
  background: #2a2b5f;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;

  &:hover {
    background: #1a1b41;
  }
`;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <SidebarContainer collapsed={collapsed}>
        <LogoContainer>
          <Logo src={logo} collapsed={collapsed} alt="Logo" />
        </LogoContainer>
      </SidebarContainer>
    );
  }

  return (
    <SidebarContainer collapsed={collapsed}>
      {/* <ToggleButton onClick={() => setCollapsed(!collapsed)}>
        <FaBars />
      </ToggleButton> */}
      <LogoContainer>
        <Logo src={logo} collapsed={collapsed} alt="Logo" />
      </LogoContainer>
      <NavList>
        {[
          { path: "/dashboard", label: "Dashboard", icon: <FaThLarge /> },
          { path: "/estoque", label: "Estoque", icon: <FaBoxOpen /> },
          { path: "/entradas", label: "Entradas", icon: <FaArrowLeft /> },
          { path: "/saidas", label: "Saídas", icon: <FaArrowRight /> },
        ].map((item, index) => (
          <NavItem
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <NavLink
              to={item.path}
              hover={hoveredIndex === index}
              collapsed={collapsed}
            >
              <NavIcon collapsed={collapsed}>{item.icon}</NavIcon>
              <NavText collapsed={collapsed}>{item.label}</NavText>
            </NavLink>
          </NavItem>
        ))}
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar;
