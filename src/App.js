import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import './App.css';

import XlsImporter from './XlsImporter';
import ReactToPrint from 'react-to-print';
import { TrashFill  } from 'react-bootstrap-icons';
import React, { useState, useRef } from 'react'; 

const date = () => {
  const data = new Date();
  const day = data.getDate().toString().padStart(2, '0');
  const month  = (data.getMonth()+1).toString().padStart(2, '0');
  const year  = data.getFullYear();

  return day + "/" + month + "/" + year;
}

const Pdf = React.forwardRef(({ subjects, equivalences }, ref) => {
  return (
    <div className='pdf' ref={ref}>
      <div className="text-center">
        <img src="image1.jpg" width={'45%'} alt="puc" />
        <p style={{ marginTop: '1%' }}><b>Centro de Registros Acadêmicos</b></p>
      </div>

      <label>Prezado Coordenador,</label>
      <p>Favor verificar se a equivalência solicitada pode ser efetivada.</p>

      Assinale um dos quadros abaixo:<br />
      <input type="checkbox" /> Não, a equivalência não pode ser considerada.<br />
      <input type="checkbox" /> Sim. A equivalência deve prevalecer para todos os casos e deve ser lançada na tabela de equivalência.

      <Table bordered style={{ marginTop: '0.5%', fontSize: '14px' }}>
        <thead>
          <tr>
            <th>Disciplinas do curso</th>
            <th>CH</th>
            <th>Código</th>
            <th>Disciplinas equivalentes</th>
            <th>CH</th>
            <th>Código</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(equivalences).map((equivalence) => {
            const extra = subjects.subjectsExtra[subjects.extraIndex[equivalence[0]]]
            const missing = subjects.subjectsMissing[subjects.missingIndex[equivalence[1]]]
            return (
              <tr key={equivalence[0]}>
                <td>{missing.name}</td>
                <td>{missing.hours}</td>
                <td>{missing.id}</td>
                <td>{extra.name}</td>
                <td>{extra.hours}</td>
                <td>{extra.id}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>

      <input type="checkbox" checked /> Sim. A equivalência, entretanto, só pode ser considerada nestes casos específicos.<br />
      <label style={{ marginTop: '1%', marginRight: '4%' }}>Aluno(a): Daniel Schlickmann Bastos</label>
      <label>Matrícula: 696777</label><br />
      <label style={{ marginBottom: '4%' }}>Data: {date()}</label>
      <br />

      _________________________________________
      <p>Assinatura e carimbo da Coordenação do Curso</p>

    </div>
  );
});


function App() {
  const componentRef = useRef();

  const [equivalences, setEquivalences] = useState({});
  const [missingSelected, setMissingSelected] = useState(null);
  const [extraSelected, setExtraSelected] = useState(null);
  const [subjects, setSubjects] = useState({ extraIndex: {}, missingIndex: {}, subjectsMissing: [], subjectsExtra: [] })

  const handleEquivalence = (id, isExtra, event) => {
    if (event.target.nodeName === 'svg' || event.target.nodeName === 'path' ) {
      return
    }

    if (isExtra) {
      if (missingSelected) {
        setEquivalences({ ...equivalences, [id]: missingSelected })
        setExtraSelected(null)
        setMissingSelected(null)
      } else {
        setExtraSelected(id)
      }
    } else {
      if (extraSelected) {
        setEquivalences({ ...equivalences, [extraSelected]: id })
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

  return (
    <div className="App">
      <Container fluid="lg">
        <h1>Equivalência de Disciplinas</h1>
        <label><b>Aluno(a): </b>Daniel Schlickmann Bastos</label>
        <p><b>Matrícula: </b>696777</p>
        <XlsImporter handleResult={setSubjects} />
        <hr />
        <Row>
          <Col md={7}>
            <h3>Disciplinas extracurriculares</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Código</th>
                  <th style={{ width: '33%' }}>Disciplina</th>
                  <th>Nota</th>
                  <th style={{ width: '10%' }}>CH</th>
                  <th style={{ width: '33%' }} colSpan="2">Equivalência</th>
                </tr>
              </thead>
              <tbody>
                {subjects.subjectsExtra.map(extra => {
                  let equivalence;

                  if (equivalences[extra.id]) {
                    equivalence = equivalences[extra.id] + " - " + subjects.subjectsMissing[subjects.missingIndex[equivalences[extra.id]]].name;
                  }

                  const clicked =  Object.keys(equivalences).includes(extra.id) || (extraSelected === extra.id);
                  return (
                    <tr className={(clicked || equivalence)? "subject-selected": ""} onClick={(event) => handleEquivalence(extra.id, true, event)} key={extra.id}>
                      <td>{extra.id}</td>
                      <td>{extra.name}</td>
                      <td>{extra.grade}</td>
                      <td>{extra.hours}</td>
                      <td>{equivalences[extra.id] && equivalence}</td>
                      <td>{equivalences[extra.id] && <TrashFill onClick={() => handleRemoveEquivalence(extra.id)}/>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
            <ReactToPrint
              trigger={() => <Button>Gerar pedido</Button>}
              content={() => componentRef.current}
            />
            <Pdf ref={componentRef} equivalences={equivalences} subjects={subjects} />
          </Col>
          <Col md={{ span: 5 }}>
            <h3>Disciplinas a cursar</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Disciplina</th>
                  <th>CH</th>
                </tr>
              </thead>
              <tbody>
                {subjects.subjectsMissing.map(missing => {
                  const clicked =  Object.values(equivalences).includes(missing.id) || (missingSelected === missing.id);

                  return (
                    <tr className={clicked ? "subject-selected": ""} onClick={(event) => handleEquivalence(missing.id, false, event)} key={missing.id}>
                      <td>{missing.id}</td>
                      <td>{missing.name}</td>
                      <td>{missing.hours}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
