import React, { Component } from 'react';
import Timetable from './timetable/timetable';
import fetchClassByCode from '../../services/classes/code';
import fetchStudentByEQID from '../../services/student/eqid';
import fetchTeacherByMIS from '../../services/teachers/mis';
import { Link } from 'react-router-dom';
import { Reoverlay } from 'reoverlay';
import { AddModal } from '../modals/add';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchAides from '../../services/aides/fetch';
import createAideClass from '../../services/classes/aide.js';
import { removeAideClass } from '../../services/classes/aide.js';
import { fetchAll } from '../../services/classes/aide.js';
import fetchAideByMIS from '../../services/aides/fetchMIS';
import AideBox from './aideClassBox/addaidetoclass';
import Student from '../student/student';
import ActionButton from '../action/button';


export class DetailedClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: {},
            parsedTimetable: null,
            parsedStudents: [],
            teacher: null,
            aides: null
        }
    }

    async componentDidMount() {
        this.setState({ loading: true });
        const data = await fetchClassByCode(this.props.match.params.code);
        const teacher = await fetchTeacherByMIS(data.staff_code);
        const aides = await fetchAll(this.props.match.params.code);
        const parsedTimetable = JSON.parse(data.timetable);
        const parsedStudents = JSON.parse(data.students);


        // TODO:
        // add endpoint to fetch group of eqids
        parsedStudents.forEach(async (student) => {
            let data = await fetchStudentByEQID(student);
            this.setState(previous => ({
                parsedStudents: [...previous.parsedStudents, data]
            }))
        })

        this.setState({
            loading: false,
            data: data,
            parsedTimetable: parsedTimetable,
            teacher: teacher,
            aides: aides
        });
    }

    refreshAides() {
        fetchAll(this.props.match.params.code)
            .then(aides => {
                this.setState({
                    aides: aides
                })
            })
    }

    render() {
        const showAddAide = async () => {
            const results = await fetchAides();
            let selected = [];

            this.state.aides.forEach(v => {
                selected.push({
                    value: v.mis,
                    label: `${v.firstname} ${v.lastname}`
                })
            });

            let aides = [];
            results.forEach(v => {
                let skip = false;
                selected.forEach(a => {
                    if (a.mis === v.mis) {
                        skip = true;
                    }
                })

                if (!skip) {
                    aides.push({
                        value: v.mis,
                        label: `${v.firstname} ${v.lastname}`
                    })
                }
            });


            Reoverlay.showModal(AddModal, {
                text: "Select Teacher Aides for this class:",
                default: selected,
                add: (selected) => {
                    let toRemove = [];
                    let toSkip = [];
                    this.state.aides.forEach(v => {
                        if (!selected.includes(v.mis)) {
                            toRemove.push(v.mis);
                        } else {
                            toSkip.push(v.mis);
                        }
                        // selected.forEach((a, i) => {
                        //     if (v.mis === a) {
                        //         toSkip.push(a);
                        //     } else if (v.mis !== a && i === selected.length - 1) {
                        //         toRemove.push(v.mis);
                        //     }
                        // })
                    });

                    toRemove.forEach(async v => {
                        await removeAideClass({ mis: v, id: this.state.data.code })
                            .then(res => {
                                if (res.length > 0) {
                                    res.forEach(error => {
                                        toast.error(error, {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: true,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            progress: undefined,
                                        });
                                    })
                                } else {
                                    toast.warning(`Removed ${v} from ${this.state.data.code}!`, {
                                        position: "top-right",
                                        autoClose: 5000,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        progress: undefined,
                                    });
                                    this.setState({
                                        aides: this.state.aides.filter(x => x.mis !== v)
                                    });
                                }
                            })
                    })

                    selected.forEach(async (v, i) => {
                        if (!toSkip.includes(v)) {
                            await createAideClass({ mis: v, id: this.state.data.code })
                                .then(async res => {
                                    if (res.length > 0) {
                                        res.forEach(error => {
                                            toast.error(error, {
                                                position: "top-right",
                                                autoClose: 5000,
                                                hideProgressBar: true,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                progress: undefined,
                                            });
                                        })
                                    } else {
                                        toast.info(`Added ${v} to ${this.state.data.code}!`, {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: true,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            progress: undefined,
                                        });

                                        const data = await fetchAideByMIS(v);
                                        this.setState({
                                            aides: [...this.state.aides, data]
                                        })
                                    }
                                })
                        }
                    })
                },
                data: aides
            })
        }

        return (
            <>
                {/* <AideClassSortList /> */}
                <div className={'card'}>
                    <div className={'card-header'}>
                        <div>
                            <h2>{this.state.data.subject}</h2>
                        </div>
                        <div>
                            <h2>{this.state.data.code}</h2>
                        </div>
                        <div>{this.state.teacher ?
                                <p><Link to={`/teacher/${this.state.teacher.mis}`}>{this.state.teacher.firstname} {this.state.teacher.lastname} ({this.state.teacher.mis})</Link> teaches this class.</p>
                                : null}</div>
                    </div>
                    <div className={'card-body'}>
                        <div className={'card-container container-large'}>
                            <p><strong>Students</strong></p>
                            <div className={'card-grid'}>
                                {this.state.parsedStudents === null ? <p>
                                    No students found.
                                </p> :
                                    this.state.parsedStudents.map(student=> (
                                                <div className={'card-grid-item'}>
                                                    <Student data={student} />
                                                </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className={'card-container container-medium-first'}>
                            <p><strong>Teacher Aides</strong></p>
                            <ActionButton text={'Modify Teacher Aides'} callback={showAddAide} args={[]} />
                            {this.state.parsedTimetable ? <AideBox aides={this.state.aides} timetable={this.state.parsedTimetable} id={this.state.data.code} /> : null}
                        </div>
                        <div className={'card-container container-medium-second'}>
                            <p><strong>Timetable</strong></p>
                            {this.state.parsedTimetable ? <Timetable data={this.state.parsedTimetable} /> : null}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}