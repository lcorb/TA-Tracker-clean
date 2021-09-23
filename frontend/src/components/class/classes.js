import React, { Component } from 'react';
import Sticky from 'react-stickynode';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import fetchAll from '../../services/classes/classes';
import BSDEClass from './class';
import ActionButton from '../action/button';
import '../../App.css';
import '../../list.css';
import fetchParentsByClassCode from '../../services/classes/parents';
import fetchStudentsByClassCode from '../../services/classes/students';

export class BSDEClassList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            bsdeClasses: [],
            classParents: {},
            gradeFilterData: [
                { value: 'All', label: 'All Grades' }
            ],
            subjectFilterData: [
                { value: 'All', label: 'All Subjects' }
            ],
            teacherFilterData: [
                { value: 'All', label: 'All Teachers' }
            ],
            classFilterData: [
                { value: 'All', label: 'All Classes' }
            ],
            gradeFilters: { 'All': true },
            subjectFilters: { 'All': true },
            teacherFilters: { 'All': true },
            classFilters: { 'All': true }
        }
        
        this.sendCodes = this.sendCodes.bind(this);
        this.sendEmails = this.sendEmails.bind(this);
        this.sendSummary = this.sendSummary.bind(this);
    }

    async componentDidMount() {
        this.setState({ loading: true });
        const bsdeClasses = await fetchAll();

        let seenGrades = {};
        let seenSubjects = {};
        let seenTeachers = {};

        let gradeFilters = [];
        let subjectFilters = [];
        let teacherFilters = [];
        let classFilters = [];

        bsdeClasses.forEach(v => {
            seenGrades[v.year] !== undefined || gradeFilters.push({ value: v.year, label: v.year });
            seenSubjects[v.subject] !== undefined || subjectFilters.push({ value: v.subject, label: v.subject });
            seenTeachers[v.mis] !== undefined || teacherFilters.push({ value: v.mis, label: ` (${v.mis}) ${v.firstname} ${v.lastname}` });
            classFilters.push({ value: v.code, label: v.code });

            seenGrades[v.year] = true;
            seenSubjects[v.subject] = true;
            seenTeachers[v.mis] = true;
        });

        gradeFilters.sort((a, b) => a.value - b.value);
        subjectFilters.sort((a, b) => a.value.localeCompare(b.value));
        teacherFilters.sort((a, b) => a.value.localeCompare(b.value));
        classFilters.sort((a, b) => a.value.localeCompare(b.value));

        this.setState({
            loading: false,
            bsdeClasses: bsdeClasses,
            gradeFilterData: this.state.gradeFilterData.concat(gradeFilters),
            subjectFilterData: this.state.subjectFilterData.concat(subjectFilters),
            teacherFilterData: this.state.teacherFilterData.concat(teacherFilters),
            classFilterData: this.state.classFilterData.concat(classFilters)
        });
    }

    handleGradeChange = (e) => {
        if (e) {
            let filtersFlat = e.map(x => x.value);
            let stateFilters = {};

            filtersFlat.forEach(v => {
                stateFilters[v] = true;
            })
            this.setState({ gradeFilters: stateFilters });
        } else {
            this.setState({ gradeFilters: {} });
        }
    }

    handleSubjectChange = (e) => {
        if (e) {
            let filtersFlat = e.map(x => x.value);
            let stateFilters = {};

            filtersFlat.forEach(v => {
                stateFilters[v] = true;
            })
            this.setState({ subjectFilters: stateFilters });
        } else {
            this.setState({ subjectFilters: {} });
        }
    }

    handleTeacherChange = (e) => {
        if (e) {
            let filtersFlat = e.map(x => x.value);
            let stateFilters = {};

            filtersFlat.forEach(v => {
                stateFilters[v] = true;
            })
            this.setState({ teacherFilters: stateFilters });
        } else {
            this.setState({ teacherFilters: {} });
        }
    }

    handleClassChange = (e) => {
        if (e) {
            let filtersFlat = e.map(x => x.value);
            let stateFilters = {};

            filtersFlat.forEach(v => {
                stateFilters[v] = true;
            })
            this.setState({ classFilters: stateFilters });
        } else {
            this.setState({ classFilters: {} });
        }
    }

    doesClassPassFilter(BSDEClass) {

        if (Object.keys(this.state.subjectFilters).length < 1
            && Object.keys(this.state.gradeFilters).length < 1
            && Object.keys(this.state.teacherFilters).length < 1) return false;


        const checkGrade = () => {
            if (this.state.gradeFilters['All'] || Object.keys(this.state.gradeFilters).length < 1) return true;
            else return this.state.gradeFilters[BSDEClass.year];

        }

        const checkSubjects = () => {
            if (this.state.subjectFilters['All'] || Object.keys(this.state.subjectFilters).length < 1) return true;
            else return this.state.subjectFilters[BSDEClass.subject];
        }

        const checkTeachers = () => {
            if (this.state.teacherFilters['All'] || Object.keys(this.state.teacherFilters).length < 1) return true;
            else return this.state.teacherFilters[BSDEClass.mis];
        }

        const checkClasses = () => {
            if (this.state.classFilters['All'] || Object.keys(this.state.classFilters).length < 1) return true;
            else return this.state.classFilters[BSDEClass.code];
        }

        return checkSubjects() && checkGrade() && checkTeachers() && checkClasses();
    }

    sendCodes() {
        let rows = [];
        this.state.bsdeClasses.forEach(c => {
            if (this.doesClassPassFilter(c)) {
                rows.push(`${c.code}`);
            }
        })

        let csvContent = 'data:text/csv;charset=utf-8,';

        rows = rows.join(',\n');
        csvContent += rows;

        let encodedUri = encodeURI(csvContent);
        let link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'class_codes.csv');
        document.body.appendChild(link);

        link.click();
    }

    sendEmails(type) {
        let rows = [];
        this.state.bsdeClasses.forEach(async c => {
            if (this.doesClassPassFilter(c)) {
                if (type === 'parent' || type ==='parentStudent') {
                    const data = await fetchParentsByClassCode(c.code);
                    const flat = data.map(v => v.email);
                    rows.concat(flat);
                } 

                if (type === 'student' || type ==='parentStudent') {
                    const data = await fetchStudentsByClassCode(c.code);
                    const flat = data.map(v => `${v.mis}@eq.edu.au`);
                    rows.concat(flat);
                }

                if (type === 'teacher') {
                    rows.push(`${c.mis}`);
                }
            }
        })

        rows = [...new Set(rows)];

        let csvContent = 'data:text/csv;charset=utf-8,';

        rows = rows.join(',\n');
        csvContent += rows;

        let encodedUri = encodeURI(csvContent);
        let link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'emails.csv');
        document.body.appendChild(link);

        link.click();
    }

    sendSummary() {
        let rows = [];
        this.state.bsdeClasses.forEach(c => {
            if (this.doesClassPassFilter(c)) {
                rows.push(`${c.code},${c.subject},${c.year},${c.mis}`);
            }
        })

        let csvContent = 'data:text/csv;charset=utf-8,code,subject,grade,teacher,\n';

        rows = rows.join(',\n');
        csvContent += rows;

        let encodedUri = encodeURI(csvContent);
        let link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'class_summary.csv');
        document.body.appendChild(link);

        link.click();
    }


    render() {
        const animatedComponents = makeAnimated();
        const styles = {
            control: (provided, state) => ({
                ...provided,
                background: '#0c2d85',
                color: '#799ec1'
            }),
            menu: (provided, state) => ({
                ...provided,
                background: '#0c2d85',
                color: '#799ec1',
                overflow: 'hidden'
            }),
        }

        return (
            <>
                <h2>Classes:</h2>
                <Sticky enabled={true} >
                    <div className={'header'}>
                        <div className={'filter-container'}>
                            <div className={'filter-section'}>
                                <p>Filters</p>
                                <div className={'filter-section-col'}>
                                    <Select
                                        options={this.state.gradeFilterData}
                                        defaultValue={this.state.gradeFilterData[0]}
                                        components={animatedComponents}
                                        isMulti
                                        closeMenuOnSelect={false}
                                        styles={styles}
                                        onChange={this.handleGradeChange}
                                    />
                                </div>
                                <div className={'filter-section-col'}>
                                    <Select
                                        options={this.state.subjectFilterData}
                                        defaultValue={this.state.subjectFilterData[0]}
                                        components={animatedComponents}
                                        isMulti
                                        closeMenuOnSelect={false}
                                        styles={styles}
                                        onChange={this.handleSubjectChange}
                                    />
                                </div>
                                <div className={'filter-section-col'}>
                                    <Select
                                        options={this.state.teacherFilterData}
                                        defaultValue={this.state.teacherFilterData[0]}
                                        components={animatedComponents}
                                        isMulti
                                        closeMenuOnSelect={false}
                                        styles={styles}
                                        onChange={this.handleTeacherChange}
                                    />
                                </div>
                                <div className={'filter-section-col'}>
                                    <Select
                                        options={this.state.classFilterData}
                                        defaultValue={this.state.classFilterData[0]}
                                        components={animatedComponents}
                                        isMulti
                                        closeMenuOnSelect={false}
                                        styles={styles}
                                        onChange={this.handleClassChange}
                                    />
                                </div>
                            </div>
                            <div className={'filter-section'}>
                                <p>Actions</p>
                                <div className='filter-section-row'>
                                    <ActionButton text={'Get Class Codes'} callback={this.sendCodes} args={[]} />
                                    <ActionButton text={'Get Teacher Emails'} callback={this.sendEmails} args={['teacher']} />
                                    <ActionButton text={'Get Student Emails'} callback={this.sendEmails} args={['student']} />
                                    <ActionButton text={'Get Parent & Student Emails'} callback={this.sendEmails} args={['parentStudent']} />
                                    <ActionButton text={'Get Class Summary'} callback={this.sendSummary} args={[]} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Sticky>
                <ul className="class-wrapper">
                    {this.state.loading ? <p>Loading...</p> : null}
                    {this.state.bsdeClasses.map(bsdeClass => (
                        this.doesClassPassFilter(bsdeClass) ?
                            <li key={bsdeClass.code} className="item">
                                <BSDEClass data={bsdeClass} />
                            </li> : null
                    ))}
                </ul>
            </>
        );
    }
}