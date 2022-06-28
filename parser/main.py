import xlrd
import json

IN_COURSE_LABEL = "Disciplinas em Curso"
TO_COURSE_LABEL = "Relação das disciplinas que o aluno deverá cursar para integralizar o currículo no qual está inserido. "
EXTRA_LABEL = "Relação das disciplinas que o aluno cursou/foi dispensado em outro currículo/curso na PUC/MG e que não serviram de base para dispensa de disciplinas do currículo atual."
COMPLEMENTARY_HOURS_LABEL = "Atividades complementares"

def split_by_student(sh):
    current_student = ""
    data_by_student = {}
    for rx in range(sh.nrows):
        row = sh.row(rx)
        if row[0].value == 'Aluno: ':
            current_student = row[1].value

        has_info = any(filter(lambda x: x.value != '',  row))
        if not has_info:
            continue
        else:
            data = data_by_student.get(current_student)
            if data:
                data_by_student[current_student] = data_by_student[current_student] + [row]
            else:
                data_by_student[current_student] = [row]

    return data_by_student

def extras_and_in_course_subjects(info):
    students = {}
    current_label = None # 0 - to course, 1 - extra

    for key, value in info.items():
        to_course = []
        extra = []

        for row in value:
            if row[0].value == TO_COURSE_LABEL:
                current_label = 0
            elif row[0].value == EXTRA_LABEL:
                current_label = 1
            elif row[0].value == COMPLEMENTARY_HOURS_LABEL or row[0].value == IN_COURSE_LABEL:
                current_label = None

            if is_valid_subject_row(row, current_label):
                if current_label == 0:
                    to_course.append(parse_subject_row(row, is_extra=False))
                elif current_label == 1:
                    extra.append(parse_subject_row(row, is_extra=True))

        if len(extra) > 0:
            students[key] = { "to_course": to_course, "extra": extra }

    return students

def is_valid_subject_row(row, is_extra):
    generic_valid = row[1].value != '' and row[3].value
    specific_valid = row[12].value != '' if is_extra else row[10].value != ''

    return generic_valid and specific_valid

def parse_subject_row(row, is_extra):
    r = { "id": int(row[1].value), "name": row[3].value  }
    if is_extra:
        grade = row[10].value
        if grade != 'Aprovado' and grade != 'Dispensada':
            grade = int(grade)

        r["grade"] = grade
        r["hours"] = int(row[12].value)
    else:
        r["hours"] = int(row[10].value)
    return r

def add_to_dict(dictt, key, value):
    data = dictt.get(key)
    if data:
        dictt[key] = dictt[key] + [value]
    else:
        dictt[key] = [value]
    return dictt


book = xlrd.open_workbook("./reldefinicaocurriculo.xls")
sh = book.sheet_by_index(0)

info = split_by_student(sh)
subjects_by_student = extras_and_in_course_subjects(info)

with open('result.json', 'w+') as fp:
    json.dump(subjects_by_student, fp, ensure_ascii=False,  indent=2)
