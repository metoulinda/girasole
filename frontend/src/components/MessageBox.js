import React from 'react';

function MessageBox(props) {
  // Se non viene passata una variante, il componente userà 'info' come valore predefinito
  const variant = props.variant || 'info';

  return (
    /* CORREZIONE 1: La classe alert- cambia dinamicamente in base alla variante passata */
    /* CORREZIONE 2: Rimosso l'attributo HTML non valido variant={...} */
    <div className={`alert alert-${variant} shadow-sm my-3`} role="alert">
      {props.children}
    </div>
  );
}

export default MessageBox;
