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

const PdfExporter = React.forwardRef(({ subjects, equivalences }, ref) => {
  const { extraIndex, missingIndex, subjectsMissing, subjectsExtra, studentInfo } = subjects;

  return (
    <div className='pdf' ref={ref}>
      <div className="text-center">
        <img src="image1.jpg" className="logo" alt="puc" />
        <p className="subtitle"><b>Centro de Registros Acadêmicos</b></p>
      </div>

      <label>Prezado Coordenador,</label>
      <p>Favor verificar se a equivalência solicitada pode ser efetivada.</p>

      Assinale um dos quadros abaixo:<br />
      <input type="checkbox" /> Não, a equivalência não pode ser considerada.<br />
      <input type="checkbox" /> Sim. A equivalência deve prevalecer para todos os casos e deve ser lançada na tabela de equivalência.

      <Table bordered className="subjects-table">
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
            const extra = subjectsExtra[extraIndex[equivalence[1]]]
            const missing = subjectsMissing[missingIndex[equivalence[0]]]
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

      <input type="checkbox" checked readOnly /> Sim. A equivalência, entretanto, só pode ser considerada nestes casos específicos.<br />
      <label className="student-name">Aluno(a): {studentInfo.name}</label>
      <label>Matrícula: {studentInfo.id}</label><br />
      <label className="date">Data: {date()}</label>
      <br />

      _________________________________________
      <p>Assinatura e carimbo da Coordenação do Curso</p>

    </div>
  );
});

PdfExporter.displayName = 'PdfExporter';

export default PdfExporter;
