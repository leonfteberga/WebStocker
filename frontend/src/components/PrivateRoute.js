import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// Componente que verifica se o usuário está autenticado
const PrivateRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem("token");

  return (
    <Route
      {...rest}
      element={token ? Component : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;