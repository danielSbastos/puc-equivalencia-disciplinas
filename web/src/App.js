import React, { useState, useRef } from 'react';
import ReactToPrint from 'react-to-print';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { TrashFill, Circle, Check } from 'react-bootstrap-icons';

import './App.css';

import XlsImporter from './XlsImporter';
import PdfExporter from './PdfExporter';
const subjectsInitState = {}

function App() {
  const componentRef = useRef();

  // global
  const [equivalences, setEquivalences] = useState({});
  const [subjects, setSubjects] = useState(subjectsInitState)
  const [seenStudents, setSeenStudents] = useState([]);
  const [students, setStudents] = useState([])

  // per student
  const [currentEquivalences, setCurrentEquivalences] = useState({});
  const [missingSelected, setMissingSelected] = useState(null);
  const [extraSelected, setExtraSelected] = useState(null);

  const [currentStudent, setCurrentStudent] = useState();

  const handleSubjects = (subjects) => {
    setSubjects(subjects)
    setStudents(Object.keys(subjects))
    setCurrentStudent(Object.keys(subjects)[0])
  }

  const handleEquivalence = (id, isExtra, event) => {
    if (event.target.nodeName === 'svg' || event.target.nodeName === 'path' ) {
      return
    }

    if (missingSelected === id) {
      setMissingSelected(null)
      return
    } else if (extraSelected === id) {
      setExtraSelected(null)
      return
    }

    if (isExtra) {
      if (missingSelected) {
        setCurrentEquivalences({ ...currentEquivalences, [missingSelected]: id })
        setExtraSelected(null)
        setMissingSelected(null)
      } else {
        setExtraSelected(id)
      }
    } else {
      if (extraSelected) {
        setCurrentEquivalences({ ...currentEquivalences, [id]: extraSelected })
        setExtraSelected(null)
        setMissingSelected(null)
      } else {
        setMissingSelected(id)
      }
    } 
  }

  const handleRemoveEquivalence = (extraId) => {
    delete currentEquivalences[extraId];
    setCurrentEquivalences({ ...currentEquivalences });
    setExtraSelected(null)
    setMissingSelected(null)
  }

  const missingSubject = (missing) => {
    let equivalence;

    let equivalenceId = currentEquivalences[missing.id];
    let clicked = Object.keys(currentEquivalences).includes(missing.id) || (missingSelected === missing.id);

    if (equivalences[currentStudent] != undefined) {
      equivalenceId = equivalenceId || equivalences[currentStudent][missing.id]
      clicked = clicked || Object.keys(equivalences[currentStudent]).includes('' + missing.id);
    }

    if (equivalenceId) {
      const extra = subjects[currentStudent].extra.filter((e) => e.id === equivalenceId)[0];
      equivalence = equivalenceId + " - " + extra.name;
    }

    return (
      <tr
        className={(clicked || equivalence)? "subject-selected": ""}
        onClick={(event) => handleEquivalence(missing.id, false, event)}
        key={missing.id}
      >
        <td>{missing.id}</td>
        <td>{missing.name}</td>
        <td>{missing.hours}</td>
        <td>{equivalenceId && equivalence}</td>
        <td>{equivalenceId && <TrashFill onClick={() => handleRemoveEquivalence(missing.id)}/>}</td>
      </tr>
    )
  }

  const extraSubject = (extra) => {
    let clicked = Object.values(currentEquivalences).includes(extra.id) || (extraSelected === extra.id);
    if (equivalences[currentStudent] != undefined) {
      clicked = clicked || Object.values(equivalences[currentStudent]).includes(extra.id);
    }

    return (
      <tr
        className={clicked ? "subject-selected": ""}
        onClick={(event) => handleEquivalence(extra.id, true, event)} key={extra.id}
      >
        <td>{extra.id}</td>
        <td>{extra.name}</td>
        <td>{extra.grade}</td>
        <td>{extra.hours}</td>
      </tr>
    )
  }

  // on Next
  const handleSeenStudent = () => {
    handleNextStudent()

    if (!seenStudents.includes(currentStudent)) setSeenStudents([ ...seenStudents, currentStudent ])

    setEquivalences({ ...equivalences, [currentStudent]: currentEquivalences })
  }

  // on Page load
  const handleCurrentStudent = ({ target: { text }}) => {
    setCurrentEquivalences(equivalences[text.trim()] || {})
    setCurrentStudent(text.trim())
  }

  const handleNextStudent = () => {
    const index = students.indexOf(currentStudent)
    if (index === (students.length - 1)) return

    const newCurrentStudent = students[index + 1]
    setCurrentStudent(newCurrentStudent)
    setCurrentEquivalences(equivalences[newCurrentStudent] || {})
  }

  const handlePreviousStudent = () => {
    const index = students.indexOf(currentStudent)
    if (index === 0) return

    const newCurrentStudent = students[index - 1]
    setCurrentStudent(newCurrentStudent)
    setCurrentEquivalences(equivalences[newCurrentStudent] || {})
  }

  const NameIcon = ({ student }) => {
    if (seenStudents.includes(student))
      return <><Check /> {student}</>
    return <><Circle /> {student}</>
  }

  return (
    <div className="App">
      <Navbar variant="dark" bg="dark" expand="lg" style={{ marginBottom: '1%' }}>
        <Container fluid>
          <Navbar.Brand>PUC-Minas | Equivalência de Disciplinas</Navbar.Brand>
          <Nav className="me-auto">
          {students.length > 0 &&
            <>
            <Nav.Link>{seenStudents.length} / {students.length}</Nav.Link>
            <NavDropdown
              title={<NameIcon student={currentStudent}/>}
              menuVariant="dark"
            >
              {students.map((student) => (
                <NavDropdown.Item key={student} onClick={handleCurrentStudent}>
                  <NameIcon student={student}/>
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            </>
            }
          </Nav>
        </Container>
      </Navbar>
      <Container fluid="lg">
        {students.length == 0 &&
          <XlsImporter handleResult={handleSubjects} />
        }
        {currentStudent && <Row>
          <Col md={7}>
            <Row>
              <Col md={5}>
                <h3>Disciplinas a cursar</h3>
              </Col>
              <Col md={7}>
                <ReactToPrint
                  trigger={() => <Button variant="dark">Gerar PDF</Button>}
                  content={() => componentRef.current}
                />
                <Button style={{ marginLeft: '1%' }} variant="outline-primary" onClick={handlePreviousStudent}>Voltar</Button>
                <Button style={{ marginLeft: '1%' }} variant="outline-primary" onClick={handleNextStudent}>Avançar</Button>
                <Button style={{ marginLeft: '1%' }} variant="success" onClick={handleSeenStudent}>Salvar e Avançar</Button>
              </Col>
            </Row>
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
                {subjects[currentStudent].to_course.map(missing => missingSubject(missing))}
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
                {subjects[currentStudent].extra.map(extra => extraSubject(extra))}
              </tbody>
            </Table>
          </Col>
         </Row>}
         <PdfExporter ref={componentRef} seenStudents={seenStudents} equivalences={equivalences} subjects={subjects} />
      </Container>
    </div>
  );
}

export default App;
