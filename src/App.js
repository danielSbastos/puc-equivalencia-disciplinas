import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import './App.css';

import ReactToPrint from 'react-to-print';
import { TrashFill  } from 'react-bootstrap-icons';
import React, { useState, useRef } from 'react'; 

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

const extraIndex = {
  56963: 0,
  57705: 1, 
  54337: 2
}

const missingIndex = {
  54817: 0,
  54938: 1,
  54334: 2,
  54834: 3,
  57338: 4
}

const date = () => {
  const data = new Date(),
      dia  = data.getDate().toString().padStart(2, '0'),
      mes  = (data.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
      ano  = data.getFullYear();
  return dia+"/"+mes+"/"+ano;
}


const Pdf = React.forwardRef(({ equivalences }, ref) => {
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
            const extra = subjectsExtra[extraIndex[equivalence[0]]]
            const missing = subjectsMissing[missingIndex[equivalence[1]]]
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
    delete equivalences[extraId];
    setEquivalences({ ...equivalences });
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
                {subjectsExtra.map(extra => {
                  let equivalence;

                  if (equivalences[extra.id]) {
                    equivalence = equivalences[extra.id] + " - " + subjectsMissing[missingIndex[equivalences[extra.id]]].name;
                  }

                  return (
                    <tr onClick={() => handleEquivalence(extra.id, true)} key={extra.id}>
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
            <Pdf ref={componentRef} equivalences={equivalences} />
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
