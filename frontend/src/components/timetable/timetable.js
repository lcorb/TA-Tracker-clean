import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import stringToColour from '../../utils/stringColour';

const Cell = styled.td`
    color: ${props => props.colour === props.getCurrentColour() ? 'black': props.colour};
    filter: ${props => props.colour === props.getCurrentColour() ? `drop-shadow(0px 0px 20px ${props.colour}) invert(100%)` : ''};
    background: ${props => props.colour === props.getCurrentColour() ? props.colour + '1A': 'rgb(150,150,150,0.3)'};
    outline: ${props => props.colour === props.getCurrentColour() ? '1px': '0px'} solid ${props => props.colour};
    outline-offset: -1px;
    &:hover {
        filter: drop-shadow(0px 0px 20px ${props => props.colour}) invert(100%);
        background: ${props => props.colour === props.getCurrentColour() ? props.colour + '1A': 'rgb(150,150,150,0.3)'};
        outline: 1px solid ${props => props.colour};
        color: black;
    }
`;

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI']
const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4'];

export default class CombinedTimetable extends Component {
    constructor(props) {
        super(props);
        let timetableElement = {};
        days.forEach((day => { timetableElement[day] = {} }))
        this.state = {
            days: days,
            periods: periods,
            timetableElement: timetableElement,
            getCurrentColour: this.props.getCurrentColour,
            setCurrentColour: this.props.setCurrentColour
        }
    }

    componentDidMount() {
        this.generateTimetable(this.props.timetable);
    }

    generateTimetable(timetableData) {
        const classKeys = Object.keys(timetableData);

        let table = {};
    
        classKeys.forEach(c => {
            let keys = Object.keys(timetableData[c].timetable);
            keys.forEach(v => {
                if (table[timetableData[c].timetable[v][0]] === undefined) {
                    table[timetableData[c].timetable[v][0]] = {};
                }
    
                table[timetableData[c].timetable[v][0]][timetableData[c].timetable[v][1]] = {
                    code: timetableData[c].code,
                    subject: timetableData[c].subject
                };
            })
        });
    
        let tableKeys = Object.keys(table);
    
        let timetable = {};
        // eslint-disable-next-line array-callback-return
        this.state.days.map(day => { timetable[day] = {} });
    
        tableKeys.forEach((time, i) => {
            let k = Object.keys(table[time]);
            k.forEach((v, idx) => {
                if (table[time][v].code.startsWith('CSM')) { return };
                timetable[time][v] = <Cell key={`${time}${v}${table[time][v].code}`} getCurrentColour={this.state.getCurrentColour} colour={stringToColour.next(table[time][v].subject)} onMouseLeave={() => this.state.setCurrentColour('')} onMouseEnter={() => this.state.setCurrentColour(stringToColour.next(table[time][v].subject))}><Link to={`/class/${table[time][v].code}`}>{table[time][v].code}</Link></Cell>
            })
        })

        this.setState({ timetableElement: timetable });
    }

    componentWillReceiveProps(nextProps) {
        this.generateTimetable(nextProps.timetable);
        this.setState({ setCurrentColour: nextProps.setCurrentColour, getCurrentColour: nextProps.getCurrentColour });
      }

    render() {
        return (
            <table>
                <thead>
                    <tr>
                        <th></th>
                        {this.state.days.map(day => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.periods.map(period => {
                            return (
                                <tr key={period}>
                                    <td className={'flat'}>{period}</td>
                                    {this.state.days.map((day, idx) => (
                                        this.state.timetableElement[day][period] ? this.state.timetableElement[day][period] : <td key={idx}></td>
                                    ))}
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        )
    }
}