import React, { useState } from "react";

import './XlsImporter.css';

export default function XlsImporterApp({ handleResult }) {
  const [fileName, setFileName] = useState('');

  const onChange = (e) => {
    const [file] = e.target.files;
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      try {
        const info = JSON.parse(bstr);
        setFileName(file.name);
        handleResult(info)
      } catch (error) {
        alert('Erro')
        console.log(error)
      }
    };

    reader.readAsText(file);
  };
  return (
    <div>
      <label htmlFor="files" className="btn btn-primary">Selecionar arquivo</label>
      <label className="file-name">{fileName}</label>
      <input className="file-input" id="files" onChange={onChange} type="file" />
    </div>
  );
}
