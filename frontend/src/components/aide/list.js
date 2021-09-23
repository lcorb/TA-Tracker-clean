import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TeacherAide from './individual';
import createAide from '../../services/aides/create';
import fetchAides from '../../services/aides/fetch';
import deleteAide from '../../services/aides/delete';


export class TeacherAideList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            aides: [],
            selectedAide: null
        }

        this.newAide = this.newAide.bind(this);
        this.setIndexAsEditable = this.setIndexAsEditable.bind(this);
    }

    async componentDidMount() {
        this.setState({
            loading: true
        })
        const aides = await fetchAides();
        this.setState({
            loading: false,
            aides: aides
        })
    }

    newAide() {
        const newAide = {
            firstname: '',
            lastname: '',
            mis: ''
        };
        this.setState(previous => ({
            aides: [...previous.aides, newAide]
        }))
        
        this.setIndexAsEditable(this.state.aides.length);
    }

    setIndexAsEditable(index) {
        this.setState({ selectedAide: index });
    }

    onSubmit = (data) => {
        this.setState({
            aides: this.state.aides.slice(0, this.state.selectedAide).concat({
                firstname: data.firstname,
                lastname: data.lastname,
                mis: data.mis
            }, this.state.aides.slice(this.state.selectedAide + 1, this.state.aides.length))
        });
        // probably await and display loader (localised within the aide box?) for this
        createAide({
            firstname: data.firstname,
            lastname: data.lastname,
            mis: data.mis
        });

        toast.info(`Created ${data.mis}!`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        this.setIndexAsEditable(-1);
    }

    deleteAide(i) {
        deleteAide(this.state.aides[i].mis);
        toast.error(`Deleted ${this.state.aides[i].mis}!`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        
        let aides = this.state.aides;
        aides.splice(i, 1);
        
        this.setState({
            aides: aides
        });
    }

    render() {
        return (
            <>
                <h2>Teacher Aide List</h2>
                <ul className="aide-wrapper">
                        <li className="blank" onClick={this.newAide} key={0}>
                            <img src="icons/magicwand.png" alt="Add new TA"></img>
                        </li>
                    {this.state.aides.map((aide, i) => (
                        <>
                            {
                                this.state.selectedAide === i ?
                                    <>
                                        <li key={i+1} className="item">
                                            <TeacherAide data={aide} editable={true} onSubmit={this.onSubmit}/>
                                        </li>
                                    </>
                                :
                                    <li key={i+1} className="item">
                                        <button onClick={() => this.setIndexAsEditable(i)}>Edit</button>
                                        <button onClick={() => this.deleteAide(i)}>Delete</button>
                                        <TeacherAide data={aide} />
                                    </li>                          
                            }
                        </>
                    ))}
                </ul>
            </>
        );
    }
}