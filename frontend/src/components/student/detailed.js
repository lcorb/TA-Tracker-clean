import React, { Component } from 'react';
import fetchStudentByEQID from '../../services/student/eqid';
import fetchStudentClasses from '../../services/student/classes';
import CombinedTimetable from '../timetable/timetable';
import Legend from '../timetable/legend';
import ActionButton from '../action/button';

export class DetailedStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: {},
            classes: [],
            timetable: {},
            currentColour: ''
        }

        this.setCurrentColour = this.setCurrentColour.bind(this);
        this.getCurrentColour = this.getCurrentColour.bind(this);
    }

    async componentDidMount() {
        this.setState({
            loading: true
        })
        const data = await fetchStudentByEQID(this.props.match.params.eqid);
        const classes = await fetchStudentClasses(this.props.match.params.eqid);

        let timetable = {};

        classes.forEach((v, i) => {
            v.timetable = JSON.parse(v.timetable);
            timetable[i] = v;
        })
        
        this.setState({
            loading: false,
            data: data,
            classes: classes,
            timetable: timetable
        })
    }

    getCurrentColour = () => { return this.state.currentColour }

    setCurrentColour = (colour) => {
        this.setState({ currentColour: colour }) 
}

    render() {
        return (
            <>
            <div className={'card'}>
                    <div className={'card-header'}>
                        <div>
                            <h3>{this.state.data.mis}</h3>
                        </div>
                        <div>
                            <h1>{this.state.data.firstname} {this.state.data.lastname}</h1>
                        </div>
                        <div>
                            <h3>{this.state.data.eqid}</h3>
                        </div>
                    </div>
                    <div className={'card-body'}>
                        <div className={'card-container container-large'}>
                            <h3>Timetable</h3>
                            <Legend timetable={this.state.timetable} setCurrentColour={this.setCurrentColour} getCurrentColour={this.getCurrentColour} />
                            <CombinedTimetable timetable={this.state.timetable} setCurrentColour={this.setCurrentColour} getCurrentColour={this.getCurrentColour} />
                        </div>
                        <div className={'card-container container-medium-first'}>
                            <h3>Details</h3>
                            <div className={'detail-grid'}>
                                <p className={'detail-grid-small'}>Email</p>
                                <p className={'detail-grid-big'}><a href={`mailto:${this.state.data.mis}@eq.edu.au`}>{this.state.data.mis}@eq.edu.au</a></p>
                                <p className={'detail-grid-small'}>Indigenous Status</p>
                                <p className={'detail-grid-big'}>{this.state.data.indigenous}</p>
                                <p className={'detail-grid-small'}>AIMS Status</p>
                                <p className={'detail-grid-big'}>{this.state.data.aims ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                        <div className={'card-container container-small-first'}>
                            <h3>Parents</h3>
                        </div>
                        <div className={'card-container container-small-second'}>
                            <h3>Actions</h3>
                            <div className={'action-button-grid'}>
                                <ActionButton text={'Email Parents'} callback={() => {}} args={[]} />
                                <ActionButton text={'Email Teachers'} callback={() => {}} args={[]} />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}