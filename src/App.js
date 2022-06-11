import React, { useState, useRef } from 'react';
import ReactToPrint from 'react-to-print';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { TrashFill  } from 'react-bootstrap-icons';

import './App.css';

import XlsImporter from './XlsImporter';
import PdfExporter from './PdfExporter';

const subjectsInitState = {
  extraIndex: {},
  missingIndex: {},
  subjectsMissing: [],
  subjectsExtra: [],
  studentInfo: {}
}

function App() {
  const componentRef = useRef();

  const [equivalences, setEquivalences] = useState({});
  const [missingSelected, setMissingSelected] = useState(null);
  const [extraSelected, setExtraSelected] = useState(null);
  const [subjects, setSubjects] = useState(subjectsInitState)

  const handleEquivalence = (id, isExtra, event) => {
    if (event.target.nodeName === 'svg' || event.target.nodeName === 'path' ) {
      return
    }

    if (isExtra) {
      if (missingSelected) {
        setEquivalences({ ...equivalences, [missingSelected]: id })
        setExtraSelected(null)
        setMissingSelected(null)
      } else {
        setExtraSelected(id)
      }
    } else {
      if (extraSelected) {
        setEquivalences({ ...equivalences, [id]: extraSelected })
        setExtraSelected(null)
        setMissingSelected(null)
      } else {
        setMissingSelected(id)
      }
    } 
  }

  const handleRemoveEquivalence = (extraId) => {
    delete equivalences[extraId];
    setEquivalences({ ...equivalences });
    setExtraSelected(null)
    setMissingSelected(null)
  }

  const missingSubject = (missing) => {
    let equivalence;

    if (equivalences[missing.id]) {
      equivalence = equivalences[missing.id] + " - " + subjects.subjectsExtra[subjects.extraIndex[equivalences[missing.id]]].name;
    }

    const clicked =  Object.keys(equivalences).includes(missing.id) || (missingSelected === missing.id);
    return (
      <tr className={(clicked || equivalence)? "subject-selected": ""} onClick={(event) => handleEquivalence(missing.id, false, event)} key={missing.id}>
        <td>{missing.id}</td>
        <td>{missing.name}</td>
        <td>{missing.hours}</td>
        <td>{equivalences[missing.id] && equivalence}</td>
        <td>{equivalences[missing.id] && <TrashFill onClick={() => handleRemoveEquivalence(missing.id)}/>}</td>
      </tr>
    )
  }

  const extraSubject = (extra) => {
    const clicked =  Object.values(equivalences).includes(extra.id) || (extraSelected === extra.id);

    return (
      <tr className={clicked ? "subject-selected": ""} onClick={(event) => handleEquivalence(extra.id, true, event)} key={extra.id}>
        <td>{extra.id}</td>
        <td>{extra.name}</td>
        <td>{extra.grade}</td>
        <td>{extra.hours}</td>
      </tr>
    )
  }

  return (
    <div className="App">
      <Container fluid="lg">
        <h1>PUC Minas | Equivalência de Disciplinas</h1>
        <label><b>Aluno(a): </b>{subjects.studentInfo?.name}</label>
        <p><b>Matrícula: </b>{subjects.studentInfo?.id}</p>
        <XlsImporter handleResult={setSubjects} />
        <hr />
        <Row>
          <Col md={7}>
            <h3>Disciplinas a cursar</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="th-small">Código</th>
                  <th className="th-large">Disciplina</th>
                  <th className="th-small">CH</th>
                  <th colSpan="2">Equivalência</th>
                </tr>
              </thead>
              <tbody>
                {subjects.subjectsMissing.map(missing => missingSubject(missing))}
              </tbody>
            </Table>
          </Col>
          <Col md={{ span: 5 }}>
            <h3>Disciplinas extracurriculares</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Disciplina</th>
                  <th>Nota</th>
                  <th>CH</th>
                </tr>
              </thead>
              <tbody>
                {subjects.subjectsExtra.map(extra => extraSubject(extra))}
              </tbody>
            </Table>
            <ReactToPrint
              trigger={() => <Button>Gerar pedido</Button>}
              content={() => componentRef.current}
            />
            <PdfExporter ref={componentRef} equivalences={equivalences} subjects={subjects} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
