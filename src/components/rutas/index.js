import React, { useState } from 'react';
import { Col, Row, Container, Modal, Card } from 'react-bootstrap';
import TableRutas from './table/tableRutas';
//import ModalUser from './modalUser';

const RutasHeader = () => {
  return (
    <Container fluid className="py-3 px-4 border-bottom mb-4">
      <Row className="align-items-center">
        <Col>
          <h2 className="mb-0">Rutas</h2>
          <span className="text-muted">Modúlo de configuration de Rutas</span>
        </Col>
      </Row>
    </Container>
  );
};

const Rutas = () => {
  
  const [lgShow, setLgShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formToShow, setFormToShow] = useState(''); 


  const handleEditClick = (user, formType) => {
    setSelectedUser(user);
    setFormToShow(formType); 
    setLgShow(true);
  };

  const handleCloseModal = () => {
    setLgShow(false);
    setSelectedUser(null);
  };

  const handleSaveChanges = () => {
    // Lógica para guardar los cambios
    console.log('Usuario actualizado:', selectedUser);
    setLgShow(false);
  };

  return (
    <>
      <RutasHeader />
      <Row className="g-3 mb-3">
        <Col lg={12}>
          <Card>
            <Card.Body>
              <TableRutas />
            </Card.Body>
          </Card>        
        </Col>
      </Row>
    </>
  );
};

export default Rutas;