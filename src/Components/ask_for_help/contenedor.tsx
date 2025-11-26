import React from 'react';
import BotonWhatsapp from './boton_whatsapp';

const BotonesFlotantes = () => {
  return (
    
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center space-y-3">
        <BotonWhatsapp />
    </div>
  );
};

export default BotonesFlotantes;