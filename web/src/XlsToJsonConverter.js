const IN_COURSE_LABEL = "Disciplinas em Curso";
const TO_COURSE_LABEL = "Relação das disciplinas que o aluno deverá cursar para integralizar o currículo no qual está inserido. ";
const EXTRA_LABEL = "Relação das disciplinas que o aluno cursou/foi dispensado em outro currículo/curso na PUC/MG e que não serviram de base para dispensa de disciplinas do currículo atual.";
const COMPLEMENTARY_HOURS_LABEL = "Atividades complementares";
const CERTIFICATION_MODULE = "Módulo Certificação Intermediária em Desenvolvimento"

const xlsToJsonConverter = (rows) => {
    const dataByStudent = groupByStudent(rows);
    const data = extractSubjects(dataByStudent);

    return { data, namesByCode };
}

const extractSubjects = (dataByStudent) => {
    const students = {};
    let currentLabel;

    Object.entries(dataByStudent).forEach(([key, rows]) => {
        const toCourse = [];
        const extra = [];

        rows.forEach(row => {
            if (row[0] === TO_COURSE_LABEL) {
                currentLabel = 0;
            } else if (row[0] === EXTRA_LABEL) {
                currentLabel = 1;
            } else if (row[0] === COMPLEMENTARY_HOURS_LABEL || row[0] === IN_COURSE_LABEL || (row[0] && row[0].includes(CERTIFICATION_MODULE))) {
                currentLabel = null;
            }

            if (isValidSubjectRow(row, currentLabel) && isValidLabel(currentLabel)) {
                const subject = parseSubjectRow(row, currentLabel);
                const subjectsList = currentLabel == 0 ? toCourse : extra;
                subjectsList.push(subject);
            }
        })

        if (extra.length > 0) {
            students[key] =  { to_course: toCourse, extra };
        }
    })

    return students;
}

const parseSubjectRow = (row, isExtra) => {
    const data = { id: parseInt(row[1].replace(",", "")), name: row[3] }
    if (isExtra) {
        let grade = row[10];
        if (grade !== 'Aprovado' && grade !== 'Dispensado') {
            grade = parseInt(grade);
        }
        
        data.grade = grade;
        data.hours = parseInt(row[12]);
    } else {
        data.hours = parseInt(row[10]);
    }
    return data;
}

const isValidLabel = l => l == 1 || l == 0;

const isValidSubjectRow = (row, isExtra) => {
    const genericValid = !!row[1] && !!row[3];
    const specificValid =  isExtra ? !!row[12] : !!row[10];

    return genericValid && specificValid; 
}

const namesByCode = {}
const isNameRow = (rowItem) => rowItem && rowItem.includes('Aluno:');
const isSocialNameRow = (rowItem) => rowItem && rowItem.includes('Nome Social:');

const extractSocialAndCivilName = (socialNameRowItem, civilNameRowItem) => {
    const socialNameCell = socialNameRowItem.split(":")[1].trim().split(' - ');
    const socialName = socialNameCell.length < 2 ? socialNameCell[0] : socialNameCell[1]
    const [code, civilName] = civilNameRowItem.split(":")[1].trim().split(' - ');

    namesByCode[code] = { civilName, socialName };

    return { code, socialName, civilName }
}

const extractName = (nameRowItem) => {
    let [code, civilName] = nameRowItem.split(' - ')

    namesByCode[code] = { civilName };

    return { socialName: '', code, civilName };
}


const groupByStudent = (rows) => {
    let currentStudent;
    let dataByStudent = {};

    rows.forEach((row, idx) => {
        if (isSocialNameRow(row[0])) {
            currentStudent = extractSocialAndCivilName(row[0], rows[idx+2][0]);
            return
        } else if (isNameRow(row[0])) {
            currentStudent = extractName(row[1])
            return
        }

        if (!currentStudent || isRowEmpty(row)) return;

        const data = dataByStudent[currentStudent.code];
        if (!data) { // no student data yet
            dataByStudent[currentStudent.code] = [row];
        } else {
            dataByStudent[currentStudent.code].push(row);
        }
    })

    return dataByStudent;
}

const isRowEmpty = (row) => {
    const info = row.filter(info => !!info);
    return (info.length === 0 || info[0] === ' ')
}

export default xlsToJsonConverter;
