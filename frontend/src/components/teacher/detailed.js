import React, { Component } from 'react';
import fetchTeacherByMIS from '../../services/teachers/mis';
import fetchClassesByStaffCode from '../../services/classes/staffcode';
import { Link } from 'react-router-dom';

export class DetailedTeacher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: {},
            classes: []
        }
    }

    async componentDidMount() {
        this.setState({
            loading: true
        })
        const data = await fetchTeacherByMIS(this.props.match.params.mis);
        const classes = await fetchClassesByStaffCode(this.props.match.params.mis);
        this.setState({
            loading: false,
            data: data,
            classes: classes
        })
    }

    render() {
        return (
            <div>
                {this.state.loading ? <p>Loading...</p> :
                    <h1>{this.state.data.firstname} - {this.state.data.mis}</h1>}
                {this.state.classes.length < 1 ? <p>No classes found.</p> : null}
                {this.state.classes.map(BSDEclass => (
                    <p><Link to={`/class/${BSDEclass.code}`}>{BSDEclass.code}</Link></p>
                ))}
            </div>
        );
    }
}