// components/AlertBox.js
import { Modal } from 'bootstrap';

export default function AlertBox(messaggio) {
  const testoElement = document.getElementById('modalTesto');
  const modalElement = document.getElementById('mioAlertModal');

  if (testoElement && modalElement) {
    testoElement.innerText = messaggio;
    const miaModal = new Modal(modalElement);
    miaModal.show();
  } else {
    // Se la modale non è ancora renderizzata nel DOM, usa l'alert nativo del browser
    alert(messaggio);
  }
}
