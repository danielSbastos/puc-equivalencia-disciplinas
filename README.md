# Equivalência de Disciplinas

## Parser

Converter de XLS para JSON.

- Baixar Python com versão 3.x, com prioridade para 3.8.10.
- Entrar na pasta `parser`
- Instalar as dependências com `pip3 install -r requirements.txt` (ou `pip`)
- Baixar o arquivo `.xls` com todos os alunos e notas e deixar dentro da pasta `parser`, o nome deve ser `reldefinicaocurriculo.xls`
- Executar com `python3 main.py` (ou `python`)
- Utilizar o arquivo resultante da execução, `result.json`, para importar no site `https://puc-equivalencia-disciplinas.netlify.app/`

## Web

- Entrar na pasta `web`
- Instalar npm com node > 14
- Executar `npm install`
- Executar `npm run start`
