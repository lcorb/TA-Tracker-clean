import React from 'react';
import { Link } from 'react-router-dom';
import StaffDetailsForm from '../forms/staffdetails';

export default function TeacherAide(props) {
        return (
            <> 
                {
                    props.editable ?
                        <StaffDetailsForm onSubmit={props.onSubmit} data={props.data}/>
                    :
                    <>
                    {props.data.firstname === '' ? <p>Nothing here yet..</p> :
                        <Link to={`/aide/${props.data.mis}`}>{props.data.firstname} {props.data.lastname} ({props.data.mis})</Link>            
                    }
                    </>
                }
            </>
        )
}