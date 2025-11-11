import React from 'react';
import BotonWhatsapp from './boton_whatsapp';
import HelpCenter from './boton_centro_de_ayuda';

const BotonesFlotantes = () => {
  return (
    
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center space-y-3">
        <HelpCenter />
        <BotonWhatsapp />
    </div>
  );
};

export default BotonesFlotantes;