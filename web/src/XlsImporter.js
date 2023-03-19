import React, { useState } from "react";
import XLSX from 'xlsx';
import xlsToJsonConverter from './XlsToJsonConverter.js';

import './XlsImporter.css';

var sheet2arr = function(sheet){
  var result = [];
  var row;
  var rowNum;
  var colNum;
  var range = XLSX.utils.decode_range(sheet['!ref']);
  for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++){
     row = [];
      for(colNum=range.s.c; colNum<=range.e.c; colNum++){
         var nextCell = sheet[
            XLSX.utils.encode_cell({r: rowNum, c: colNum})
         ];
         if( typeof nextCell === 'undefined' ){
            row.push(void 0);
         } else row.push(nextCell.w);
      }
      result.push(row);
  }
  return result;
};

export default function XlsImporterApp({ handleResult, handleSignature }) {
  const [fileName, setFileName] = useState('');
  const [signatureFile, setSignatureFile] = useState('');

  const onChange = (e) => {
    const [file] = e.target.files;
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target.result;
      try {
        const workbook = XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const subjects = xlsToJsonConverter(sheet2arr(sheet));
        setFileName(file.name);
        handleResult(subjects)
      } catch (error) {
        alert('Erro')
        console.log(error)
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const onChangeSignature = (e) => {
    if (e.target.files.length !== 0) {
      const [file] = e.target.files;

      handleSignature(file)
      setSignatureFile(file.name)
    }
  }

  return (
    <div>
      <label htmlFor="files" className="btn btn-primary">Selecionar arquivo</label>
      <label className="file-name">{fileName}</label>
      <input className="file-input" id="files" onChange={onChange} type="file" />
      <br />
      <br />

      <label htmlFor="signature" className="btn btn-primary">Selecionar assinatura</label>
      <br/><i>Resolução sugerida: largura: 600px x altura: 300px</i>
      <br />
      <label className="file-name">{signatureFile}</label>
      <input className="file-input" id="signature" onChange={onChangeSignature} type="file" accept="image/jpg, image/jpeg, image/png" />
      </div>
  );
}
