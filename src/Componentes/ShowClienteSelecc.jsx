import React from 'react';
import '../Routes/Css/ShowCli.css';

export const ShowClienteSelecc = ({ Cliente }) => {
  return (
    <div className="show-cliente-container">
      <h3>Información del Cliente</h3>
      <div>
        <strong>Nombre:</strong> {Cliente?.Nombre || 'N/A'}
      </div>
      <div>
        <strong>Teléfono:</strong> {Cliente?.NumeroTelefono || 'N/A'}
      </div>
      <div>
        <strong>RUT:</strong> {Cliente?.rut || 'N/A'}
      </div>
      <div>
        <strong>Dirección:</strong> {Cliente?.direccion || 'N/A'}
      </div>
      <div>
        <strong>Tipo:</strong> {Cliente?.Tipo || 'N/A'}
      </div>
      <div>
        <strong>Mail:</strong> {Cliente?.Mail || 'N/A'}
      </div>
    </div>
  );
};
