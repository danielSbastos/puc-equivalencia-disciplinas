import React from "react";
import * as XLSX from "xlsx";

const extractInfo = (data) => {
  const startMissingText = "Relação das disciplinas que o aluno deverá cursar para integralizar o currículo no qual está inserido. ,,,,,,\nBase Bacharel,Código,Disciplina,Carga Horária,Crédito,Período,,\n"
  const endMissingText = "\nAtividades complementares,"
  const missing = data.substring(data.search(startMissingText) + startMissingText.length, data.search(endMissingText))

  const startExtraText = "Disciplinas Extra-Curriculo,Relação das disciplinas que o aluno cursou/foi dispensado em outro currículo/curso na PUC/MG e que não serviram de base para dispensa de disciplinas do currículo atual.,,,,,,\nAno/Sem.,Disciplinas Cursadas/Dispensadas ,Nota,Carga Horária,Crédito,Optativa,,\n"
  const endExtraText = "Disciplinas em Curso,Relação das disciplinas que o aluno está cursando no presente semestre"
  const extra = data.substring(data.search(startExtraText) + startExtraText.length, data.search(endExtraText))

  const missingIndex = {}
  const subjectsMissing = missing.split("\n").map((subject, idx) => {
    const info = subject.split(",");
    if (info[0] === "") return
    const id = info[0]
    const hashInfo = { id, name: info[1], hours: info[2] }
    missingIndex[info[0]] = idx
    return hashInfo
  }).filter((elem) => elem !== undefined);

  const extraIndex = {}
  const subjectsExtra = extra.split("\n").map((subject, idx) => {
    const info = subject.split(",");
    if (info[0] === "") return
    const id = info[1] + info[2]
    const hashInfo = { id: id.substring(1, id.length - 1), name: info[3], grade: info[5], hours: info[6] }
    extraIndex[id.substring(1, id.length - 1)] = idx 
    return hashInfo
  }).filter((elem) => elem !== undefined);

  return { extraIndex, missingIndex, subjectsMissing, subjectsExtra }
}


export default function XlsImporterApp({ handleResult }) {
  const onChange = (e) => {
    const [file] = e.target.files;
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      handleResult(extractInfo(data));
    };
    reader.readAsBinaryString(file);
  };
  return (
    <div>
      <label htmlFor="files" className="btn btn-primary">Selecionar arquivo</label>
      <input id="files" onChange={onChange} style={{ visibility: "hidden" }} type="file" />
    </div>
  );
}
