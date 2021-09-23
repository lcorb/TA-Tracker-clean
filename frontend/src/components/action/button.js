import React from 'react';
import './button.css';

const ActionButton = (props) => {
    return (
        <button onClick={() => props.callback(...props.args)} className={'action-button'}>{props.text}</button>
    )
}

export default ActionButton;