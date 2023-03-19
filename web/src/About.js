import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

function About() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <span onClick={handleShow}>
        Sobre nós | Contato
      </span>

      <Modal show={show} onHide={handleClose} backdrop='static'>
        <Modal.Header closeButton>
          <Modal.Title>Sobre nós | Contato</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Sistema desenvolvido por <a onClick="window.open('https://www.linkedin.com/in/daniel-schlickmann-bastos-717ba9141/', '_blank')" target="_blank" href="https://www.linkedin.com/in/daniel-schlickmann-bastos-717ba9141/">Daniel Schlickmann Bastos</a>, aluno de graduação da Ciência de Computação
            da Praça da Liberdade, junto com o coordenador <a onClick="window.open('https://www.linkedin.com/in/felipecunhabh/', '_blank')" target="_blank" href="https://www.linkedin.com/in/felipecunhabh/">Felipe Domingos da Cunha</a>.
            <br /><br />
            Contato: <a onClick="window.open('mailto: ccomp.praca@pucminas.br', '_blank')" href="mailto: ccomp.praca@pucminas.br">ccomp.praca@pucminas.br</a>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default About;
