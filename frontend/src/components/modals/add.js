import React, { Component } from 'react';
import { ModalWrapper, Reoverlay } from 'reoverlay';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import './modal.css';
import '../../fancy.css';
import 'reoverlay/lib/ModalWrapper.css';

export class AddModal extends Component {
    constructor(props) { 
        super();
        this.state = {
            text: props.text,
            default: props.default,
            add: props.add,
            data: props.data,
            selected: []
        }

        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    formulateDefault() {

    }

    closeModal = () => {
        Reoverlay.hideModal();
    }

    handleChange = (e) => {
        if (e) {
            this.setState({
                selected: e.map(x => x.value)
            })
        } else {
            this.setState({selected: []})
        }
    }

    handleClick = () => {
        this.state.add(this.state.selected);
        this.closeModal();
    }

    render() {
        const animatedComponents = makeAnimated();
        const styles = {
            control: (provided, state) => ({
                ...provided,
                background: '#0c2d85',
                color: '#799ec1',
              }),
            menu: (provided, state) => ({
                ...provided,
                background: '#0c2d85',
                color: '#799ec1'
            }),
        }
        return (
            <ModalWrapper>
                <div className="content">
                    <p>{this.state.text}</p>
                    <Select 
                        options={this.state.data}
                        defaultValue={this.state.default}
                        components={animatedComponents}
                        isMulti
                        closeMenuOnSelect={false}
                        styles={styles}
                        onChange={this.handleChange} />
                    <button onClick={this.handleClick} className="gradient-button">Add Selected</button>
                    {/* <button onClick={this.closeModal} className="gradient-button">Close</button> */}
                </div>
            </ModalWrapper>
        )
    }
}