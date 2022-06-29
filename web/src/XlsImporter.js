import React, { useState } from "react";

import './XlsImporter.css';

export default function XlsImporterApp({ handleResult, handleSignature }) {
  const [fileName, setFileName] = useState('');
  const [signatureFile, setSignatureFile] = useState('');

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
      <label className="file-name">{signatureFile}</label>
      <input className="file-input" id="signature" onChange={onChangeSignature} type="file" accept="image/jpg, image/jpeg, image/png" />
      </div>
  );
}
