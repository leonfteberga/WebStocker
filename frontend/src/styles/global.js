import { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;  
  }

  body {
    /* display: flex; */
    overflow-x: hidden; /* Desativa o rolamento horizontal */
    justify-content: center;
    background-color: #f2f2f2;
  }
`;

export default Global;
