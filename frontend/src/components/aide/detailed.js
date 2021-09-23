import React, { Component } from 'react';
import fetchAideByMIS from '../../services/aides/fetchMIS';


export class DetailedAide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: {},
        }
    }

    async componentDidMount() {
        this.setState({
            loading: true
        })
        const data = await fetchAideByMIS(this.props.match.params.mis);
        this.setState({
            loading: false,
            data: data
        })
    }

    render() {
        return (
            <div>   
                {
                    this.state.loading ? <p>Loading...</p> :
                    <h1>{this.state.data.firstname} - {this.state.data.mis}</h1>
                }
            </div>
        );
    }
}