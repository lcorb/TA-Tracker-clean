import React from 'react';
import { Link } from 'react-router-dom';

export default function Teacher(props) {
    return (
        <span>
            <Link to={`/teacher/${props.data.mis}`}>{props.data.firstname} {props.data.lastname} ({props.data.mis})</Link>
        </span>
    )
}