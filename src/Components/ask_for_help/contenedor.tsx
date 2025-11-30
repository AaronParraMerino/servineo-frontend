import React from 'react';
import BotonWhatsapp from './boton_whatsapp';

const BotonesFlotantes = () => {
  return (
    // Ya NO es fixed, solo apila el botón de WhatsApp
    <div className="flex flex-col items-center space-y-3">
      <BotonWhatsapp />
    </div>
  );
};

export default BotonesFlotantes;
