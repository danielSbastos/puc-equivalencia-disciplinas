import Table from 'react-bootstrap/Table';
import React from 'react';

import './PdfExporter.css';

const date = () => {
  const data = new Date();
  const day = data.getDate().toString().padStart(2, '0');
  const month = (data.getMonth() + 1).toString().padStart(2, '0');
  const year = data.getFullYear();

  return day + "/" + month + "/" + year;
}

const PdfHeader = ({ forAll }) => (
  <>
    <div className="text-center">
      <img src="image1.jpg" className="logo" alt="puc" />
      <p className="subtitle"><b>Centro de Registros Acadêmicos</b></p>
    </div>

    <label>Prezado Coordenador,</label>
    <p>Favor verificar se a equivalência solicitada pode ser efetivada.</p>

    Assinale um dos quadros abaixo:<br />
    <input type="checkbox" /> Não, a equivalência não pode ser considerada.<br />
    <input type="checkbox" checked={forAll} /> Sim. A equivalência deve prevalecer para todos os casos e deve ser lançada na tabela de equivalência.
  </>
)

const Pdf = ({ signature, studentCode, studentNames, subjects, equivalences }) => {
  if (Object.values(equivalences).length == 0) return

  return (
    <>
      <PdfHeader />
      <Table size="sm" bordered className="subjects-table">
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
        const extraId = equivalence[1]
        const toCourseId = equivalence[0]

        const toCourse = subjects.to_course.find((s) => s.id === parseInt(toCourseId))
        const extra = subjects.extra.find((s) => s.id === extraId)

        return (
          <tr key={equivalence[0]}>
            <td>{toCourse.name}</td>
            <td>{toCourse.hours}</td>
            <td>{toCourse.id}</td>
            <td>{extra.name}</td>
            <td>{extra.hours}</td>
            <td>{extra.id}</td>
          </tr>
        )
      })}
      </tbody>
      </Table>

      <input type="checkbox" checked readOnly /> Sim. A equivalência, entretanto, só pode ser considerada nestes casos específicos.<br />

      <br />
      <label className="student-name">Nome Social: {studentNames.socialName}</label>
      <br />
      <label className="student-name">Nome Civil: {studentNames.civilName}</label>
      <br />
      <label>Matrícula: {studentCode}</label><br />
      <br />

      <label className="date">Data: {date()}</label>
      <br />
      <img src={URL.createObjectURL(signature)} style={{ height: '100px' }}  />
      <br />
      _________________________________________
      <p>Assinatura e carimbo da Coordenação do Curso</p>
      <div className="pagebreak"> </div>
    </>
  )
}

const PdfExporter = React.forwardRef(({ signature, seenStudents, subjects, equivalences, namesByCode }, ref) => {
  const Pdfs = () => {
    if (Object.keys(equivalences).length === 0) return <></>
    
    return seenStudents.map(studentCode =>
      <Pdf
        signature={signature}
        studentCode={studentCode}
        studentNames={namesByCode[studentCode]}
        subjects={subjects[studentCode]}
        equivalences={equivalences[studentCode]}
      />
    )
  }

  return (
    <div className='pdf' ref={ref}>
      <Pdfs />
    </div>
  )
});

PdfExporter.displayName = 'PdfExporter';

export default PdfExporter;
