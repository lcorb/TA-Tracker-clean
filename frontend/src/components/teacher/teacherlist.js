import React, { Component } from 'react';
import fetchAll from '../../services/teachers/teachers';
import Teacher from './teacher';

export class TeacherList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            teachers: []
        }
    }

    async componentDidMount() {
        this.setState({loading: true});
        const teachers = await fetchAll();
        this.setState({
            loading: false,
            teachers: teachers
        });
    }

    render() {
        return (
        <div>
            <h2>Teachers:</h2>
            <ul className="student-wrapper">
                {this.state.loading ? <p>Loading...</p> : null}
                {this.state.teachers.map(teacher => (
                    <li key={teacher.mis} className="item">
                        <Teacher data={teacher} />
                    </li>
                ))}
            </ul>
        </div>
        );
    }
}