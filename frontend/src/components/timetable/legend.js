import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import './legend.css';
import '../../utils/stringColour';
import stringToColour from '../../utils/stringColour';

const Bubble = styled.div`
    border-radius: 15px;
    padding: 10px;
    border: 1px solid ${props => props.colour};
    background: rgba(255, 255, 255, 0.4);
    color: ${props => props.colour === props.getCurrentColour() ? 'black': props.colour};
    filter: ${props => props.colour === props.getCurrentColour() ? `drop-shadow(8px 8px 20px ${props.colour}) invert(100%)` : ''};
    box-shadow: 0px 7px 10px rgba(0, 0, 0, 0.3);
    &:hover {
        filter: drop-shadow(8px 8px 20px ${props => props.colour}) invert(100%);
        color: black;
      }
`;

const Dot = styled.div`
    border-radius: 50%;
    padding: 3px;
    background: ${props => props.colour};
    position: absolute;
    margin-top: 5px;
`;

export default function Legend(props) {
    const classValues = Object.values(props.timetable);

    return (
        <div className="bubble-grid">
            {classValues.map(v => {
                return <Bubble colour={stringToColour.next(v.subject)} key={v.code} getCurrentColour={props.getCurrentColour} onMouseEnter={() => props.setCurrentColour(stringToColour.next(v.subject))} onMouseLeave={() => props.setCurrentColour('')}>
                    <Dot colour={stringToColour.next(v.subject)}/>
                    <Link to={`/class/${v.code}`}>{v.code}</Link> - <Link to={`/teacher/${v.mis}`}>{v.firstname} {v.lastname}</Link>
                </Bubble>
            })}
        </div>
    )
}