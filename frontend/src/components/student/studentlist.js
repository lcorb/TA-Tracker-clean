import React, { Component } from 'react';
import Sticky from 'react-stickynode';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import fetchAll from '../../services/student/student';
import Student from './student';
import ActionButton from '../action/button';
import '../../App.css';
import '../../list.css';

export class StudentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            students: [],
            currentStudentShownCount: 0,
            sticky: false,
            gradeFilterData: [
                {value: 'AllGrades', label: 'All Grades'},
                {value: '1', label: '1'},
                {value: '2', label: '2'},
                {value: '3', label: '3'},
                {value: '4', label: '4'},
                {value: '5', label: '5'},
                {value: '6', label: '6'},
                {value: '7', label: '7'},
                {value: '8', label: '8'},
                {value: '9', label: '9'},
                {value: '10', label: '10'},
                {value: '11', label: '11'},
                {value: '12', label: '12'}],
            characteristicFilterData: [
                {value: 'AllCharacteristics', label: 'All Characteristics'},
                {value: 'M', label: 'Male'},
                {value: 'F', label: 'Female'},
                {value: 'Neither Aboriginal nor Torres Strait Islander Origin', label: 'Non-Indigenous'},
                {value: 'Aboriginal but not Torres Strait Islander Origin', label: 'Aboriginal'},
                {value: 'Torres Strait Islander but not Aboriginal Origin', label: 'Torres Strait Islander'},
                {value: 'Both Aboriginal and Torres Strait Islander Origin', label: 'Both A & T'},
                {value: '1', label: 'AIMS'},
                {value: '0', label: 'Not AIMS'},
            ],
            gradeFilters: {'AllGrades': true}, 
            characteristicFilters: {'AllCharacteristics': true}
        }

        this.generateEmailCSV = this.generateEmailCSV.bind(this);
    }

    async componentDidMount() {
        this.setState({loading: true});
        const students = await fetchAll();
        this.setState({
            loading: false,
            students: students,
            currentStudentShownCount: students.length
        });
    }

    headerStateChange(status) {
        switch (status) {
            case Sticky.STATUS_ORIGINAL:
                this.setState({ sticky: false });
                break;

            case Sticky.STATUS_FIXED:
                this.setState({ sticky: true });
        
                break;
        
            default:
                break;
        }
    }

    handleCharacteristicChange = (e) => {
        if (e) {
            let filtersFlat = e.map(x => x.value);
            let stateFilters = {};
            
            filtersFlat.forEach(v => {
                stateFilters[v] = true;
            })
            this.setState({ characteristicFilters: stateFilters });
        } else {
            this.setState({ characteristicFilters: {} });
        }
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

    doesStudentPassFilter(student) {

        if (Object.keys(this.state.characteristicFilters).length < 1 && Object.keys(this.state.gradeFilters).length < 1) return false;

        const checkCharacteristics = () => {
            if (this.state.characteristicFilters['AllCharacteristics'] || Object.keys(this.state.characteristicFilters).length < 1) return true;
            // const keys = Object.keys(this.state.characteristicFilters);

            // let valid = true;
            // keys.forEach(v => {
            //     if (!(
            //         student.indigenous === v.value ||
            //             student.gender === v.value ||
            //             student.aims === v.value
            //     )) { valid = false }
            // })

            // return valid;
            else return this.state.characteristicFilters[student.indigenous] !== undefined ||
                        this.state.characteristicFilters[student.gender] !== undefined ||
                        this.state.characteristicFilters[student.aims] !== undefined
        }

        const checkGrade = () => {
            if (this.state.gradeFilters['AllGrades'] || Object.keys(this.state.gradeFilters).length < 1) return true;
            else return this.state.gradeFilters[student.grade];
        }

        return checkCharacteristics() && checkGrade();
    }

    generateEmailCSV() {
        let rows = [];
        this.state.students.forEach(student => {
            if (this.doesStudentPassFilter(student)) {
                rows.push(`${student.mis}@eq.edu.au`);
            }
        })

        let csvContent = 'data:text/csv;charset=utf-8,';

        rows = rows.join(',\n');
        csvContent += rows;

        let encodedUri = encodeURI(csvContent);
        let link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'student_emails.csv');
        document.body.appendChild(link);

        link.click();
    }

    generateMailTo() {

    }

    render() {
        const animatedComponents = makeAnimated();
        const styles = {
            control: (provided, state) => ({
                ...provided,
                background: '#505D98',
                color: '#799ec1'
              }),
            menu: (provided, state) => ({
                ...provided,
                background: '#505D98',
                color: '#799ec1'
            }),
        }

        
        return (
        <>
            <h2>Students</h2>
            <p>Statistics</p>
            <p>There are {this.state.students.length} students in total.</p>
            <Sticky enabled={true} onStateChange={this.headerStateChange} >
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
                                    options={this.state.characteristicFilterData}
                                    defaultValue={this.state.characteristicFilterData[0]}
                                    components={animatedComponents}
                                    isMulti
                                    closeMenuOnSelect={false}
                                    styles={styles}
                                    onChange={this.handleCharacteristicChange}
                                    />
                            </div>
                        </div>
                        <div className={'filter-section'}>
                            <p>Actions</p>
                            <div className='filter-section-row'>
                                <ActionButton text={'Get Emails'} callback={this.generateEmailCSV} args={[]} />
                                <ActionButton text={'Send Email'} callback={()=>{}} args={[]} />
                            </div>
                        </div>
                    </div>
                </div>
            </Sticky>
            <ul className="student-wrapper">
                {this.state.loading ? <p>Loading...</p> : null}
                {this.state.students.map((student) => (
                    this.doesStudentPassFilter(student) ?
                    <li key={student.mis} className="item">
                        <Student data={student} />
                    </li> : null
                ))}
            </ul>
        </>
        );
    }
}