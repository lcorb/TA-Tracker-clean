import React from 'react';
import { Link } from 'react-router-dom';

export default function Student(props) {
    return (
        <div className={'thumbnail'}>
            <Link to={`/student/eqid/${props.data.eqid}`}>
                {props.data.studentname} ({props.data.mis})
            </Link>
        </div>
    )
}

export function StudentHover(props) {
    return (
        <>
            <div className="thumbnail">
                {props.data.studentname} ({props.data.mis})
            </div>
            <Link to={`/student/eqid/${props.data.eqid}`}>
                <div className="info">
                    <p>Year {props.data.grade}</p>
                    {!props.data.aims || <p>Has AIMS profile</p>}
                    {props.data.indigenous}
                </div>
            </Link>
        </>
    )
}
