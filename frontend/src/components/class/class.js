import React from 'react';
import Timetable from './timetable/timetable';
import { Link } from 'react-router-dom';

export default function BSDEClass(props) {

    const parsedTimetable = JSON.parse(props.data.timetable);

    return (
        <>
            <Link to={`/class/${props.data.code}`}>{props.data.code} - Year {props.data.year} {props.data.subject} ({props.data.staff_code})</Link>
            {/* <Timetable data={parsedTimetable} /> */}
        </>
    )
}