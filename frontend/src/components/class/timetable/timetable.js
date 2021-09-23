import React from 'react';
import './timetable.css';

export default function Timetable(props) {
    const timetableKeys = Object.keys(props.data);
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
    const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4'];

    let table = {};

    timetableKeys.forEach(time => {
        table[props.data[time][0]] = props.data[time][1];
    });

    let tableKeys = Object.keys(table);

    let timetable = {};
    // eslint-disable-next-line array-callback-return
    days.map(day => {timetable[day] = {}})

    tableKeys.forEach((time, i) => {
        timetable[time][table[time]] = <div>Class {i + 1}</div>
    })


    return (
    <table>
        <thead>
            <tr>
                <th></th>
                {days.map(day => (
                    <th key={day}>{day}</th>
                ))}
            </tr>
        </thead>
        <tbody>            
            {
                periods.map(period => {
                    return (
                        <tr key={period}>
                            <td className={'flat'}>{period}</td>
                            {days.map(day => (
                                <td key={day+period}>
                                    {timetable[day][period]}
                                </td>
                            ))}
                        </tr>
                    )
                })
            }
        </tbody>
    </table>
    )
}