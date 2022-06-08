import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import './App.css';

import { TrashFill  } from 'react-bootstrap-icons';
import { useState } from 'react'; 

const subjectsMissing = [
  { id: 54817, name: 'ARQUITETURA DE COMPUTADORES II', hours: 80 },
  { id: 54938, name: 'OPTATIVA III (Virtual)', hours: 80 },
  { id: 54334, name: 'FILOSOFIA: RAZÃO E MODERNIDADE', hours: 40 },
  { id: 54834, name: 'FUNDAMENTOS TEÓRICOS DA COMPUTAÇÃO', hours: 80 },
  { id: 57338, name: 'COMPUTAÇÃO DISTRIBUÍDA (Semipresencial)', hours: 60 }
]

const subjectsExtra = [
  { id: 56963, name: 'FUNDAMENTOS DE ENGENHARIA DE SOFTWARE', grade: 98, hours: 80 },
  { id: 57705, name: 'ARQUITETURA DE COMPUTADORES II', grade: 98, hours: 80 },
  { id: 54337, name: 'FUNDAMENTOS DA MATEMÁTICA (Virtual)', grade: 92, hours: 80 }
]

const index = {
  54817: 'ARQUITETURA DE COMPUTADORES II',
  54938: 'OPTATIVA III (Virtual)',
  54334: 'FILOSOFIA: RAZÃO E MODERNIDADE',
  54834: 'FUNDAMENTOS TEÓRICOS DA COMPUTAÇÃO',
  57338: 'COMPUTAÇÃO DISTRIBUÍDA (Semipresencial)',
  56963: 'FUNDAMENTOS DE ENGENHARIA DE SOFTWARE',
  57705: 'ARQUITETURA DE COMPUTADORES II',
  54337: 'FUNDAMENTOS DA MATEMÁTICA (Virtual)'
}

function App() {
  const [equivalences, setEquivalences] = useState({});
  const [missingSelected, setMissingSelected] = useState(null);
  const [extraSelected, setExtraSelected] = useState(null);
  const [showPdf, setShowPdf] = useState(false);

  const handleEquivalence = (id, isExtra) => {
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
    setEquivalences({ ...equivalences, [extraId]: null })
  }

  return (
    <div className="App">
      <Container fluid="lg">
        <h1>Equivalência de Disciplinas</h1>
        <label><b>Aluno(a): </b>Daniel Schlickmann Bastos</label>
        <p><b>Matrícula: </b>696777</p>
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
                {subjectsExtra.map(extra => (
                  <tr onClick={() => handleEquivalence(extra.id, true)} key={extra.id}>
                    <td>{extra.id}</td>
                    <td>{extra.name}</td>
                    <td>{extra.grade}</td>
                    <td>{extra.hours}</td>
                    <td>{equivalences[extra.id]} - {index[equivalences[extra.id]]}</td>
                    <td>{equivalences[extra.id] && <TrashFill onClick={() => handleRemoveEquivalence(extra.id)}/>}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button onClick={() => setShowPdf(true)}>Gerar pedido</Button>
          </Col>
          <Col md={{ span: 4, offset: 1 }}>
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
                {subjectsMissing.map(missing => (
                  <tr onClick={() => handleEquivalence(missing.id, false)} key={missing.id}>
                    <td>{missing.id}</td>
                    <td>{missing.name}</td>
                    <td>{missing.hours}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
