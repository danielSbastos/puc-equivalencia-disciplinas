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
import About from './About';

const subjectsInitState = {}

function App() {
  const componentRef = useRef();

  // global
  const [signature, setSignature] = useState();
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
        let missingWithNewExtras = (currentEquivalences[missingSelected] || []).concat(id)
        setCurrentEquivalences({ ...currentEquivalences, [missingSelected]: missingWithNewExtras })
        setExtraSelected(null)
        setMissingSelected(null)
      } else {
        setExtraSelected(id)
      }
    } else {
      if (extraSelected) {
        let missingWithNewExtras = (currentEquivalences[id] || []).concat(extraSelected)
        setCurrentEquivalences({ ...currentEquivalences, [id]: missingWithNewExtras })
        setExtraSelected(null)
        setMissingSelected(null)
      } else {
        setMissingSelected(id)
      }
    } 
  }

  const handleRemoveEquivalence = (missingId, extraId) => {
    let filteredExtrasFromMissing = (currentEquivalences[missingId] || []).filter(extra => extra != extraId);

    if (filteredExtrasFromMissing.length === 0) {
      delete currentEquivalences[missingId]
      setCurrentEquivalences({ ...currentEquivalences });
    } else {
      setCurrentEquivalences({ ...currentEquivalences, [missingId]: filteredExtrasFromMissing });
    }

    setExtraSelected(null)
    setMissingSelected(null)
  }

  const missingSubject = (missing) => {
    let equivalence;
    const extras = [];

    let equivalenceIds = currentEquivalences[missing.id] || [];
    let clicked = Object.keys(currentEquivalences).includes(missing.id) || (missingSelected === missing.id);

    if (equivalences[currentStudent] != undefined) {
      equivalenceIds = equivalenceIds || equivalences[currentStudent][missing.id]
      clicked = clicked || Object.keys(equivalences[currentStudent]).includes('' + missing.id);
    }

    if (equivalenceIds?.length > 0) {
      equivalenceIds.forEach(equivalenceId => {
        let extra = subjects[currentStudent].extra.filter((e) => e.id === equivalenceId)[0];
        extras.push(extra);
      })
      equivalence = equivalenceIds[0] + " - " + extras[0].name;
    }

    return (
      <>
      <tr
        className={(clicked || equivalence)? "subject-selected": ""}
        onClick={(event) => handleEquivalence(missing.id, false, event)}
        key={missing.id}
      >
        <td>{missing.id}</td>
        <td>{missing.name}</td>
        <td>{missing.hours}</td>
        <td>{equivalenceIds.length > 0 && equivalenceIds[0] + " - " + extras[0].name}</td>
        <td>{equivalenceIds.length > 0 && <TrashFill onClick={() => handleRemoveEquivalence(missing.id, equivalenceIds[0])}/>}</td>
      </tr>

      {(equivalenceIds || []).slice(1).map((equivalenceId, idx) =>
        <tr
          className={(clicked || equivalence)? "subject-selected": ""}
          onClick={(event) => handleEquivalence(missing.id, false, event)}
          key={missing.id}
        >
          <td></td>
          <td></td>
          <td></td>
          <td>{equivalenceId + " - " + extras[idx + 1].name}</td>
          <td><TrashFill onClick={() => handleRemoveEquivalence(missing.id, equivalenceId)}/></td>
        </tr>
      )}
      </>
    )
  }

  const extraSubject = (extra) => {
    const currentExtras = Object.values(currentEquivalences)

    let clicked = currentExtras.some(x => x.includes(extra.id)) || (extraSelected === extra.id);
    if (equivalences[currentStudent] != undefined) {
      clicked = clicked || currentExtras.some(x => x.includes(extra.id));
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
        <Container fluid="lg">
          <Navbar.Brand>PUC Minas | Equivalência de Disciplinas</Navbar.Brand>
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
          <Nav>
            <Nav.Link className="sobre">
              <About />
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container fluid="lg">
        {(students.length == 0 || signature == null) &&
          <XlsImporter handleSignature={setSignature} handleResult={handleSubjects} />
        }
        {currentStudent && signature != null  && <Row>
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
        {(students.length > 0 && signature != null) &&
         <PdfExporter ref={componentRef} signature={signature} seenStudents={seenStudents} equivalences={equivalences} subjects={subjects} />
        }
      </Container>
    </div>
  );
}

export default App;
