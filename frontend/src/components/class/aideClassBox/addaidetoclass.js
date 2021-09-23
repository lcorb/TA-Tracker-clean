import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ReactSortable } from "react-sortablejs";
import { addAideToTimetable, removeAideFromTimetable } from '../../../services/classes/aide';
import { fetchTimetabledAides } from '../../../services/classes/aide';
import '../../../App.css';
import './aideClassBox.css';

export default class AideBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            iterableTimetable: [],
            aidesInTimetable: {},
            aidesList: []
        };

        this.removeAide = this.removeAide.bind(this);
    }

    componentDidMount() {
        this.initialiseData();
    }

    async initialiseData() {
        const keys = Object.keys(this.props.timetable);

        const aides = await fetchTimetabledAides(this.state.id);

        console.log(aides);

        let iterableTimetable = [];
        let aidesInTimetable = {}
        let aidesList = [];

        this.props.aides.forEach(v => {
            aidesList.push({
                'id': v.mis,
                'label': `${v.firstname} ${v.lastname}`
            });
        })

        keys.forEach((v) => {
            iterableTimetable.push({ 'day': this.props.timetable[v][0], 'period': this.props.timetable[v][1] });
            aidesInTimetable[this.props.timetable[v][0]] ? void (0) : aidesInTimetable[this.props.timetable[v][0]] = {};
            aidesInTimetable[this.props.timetable[v][0]][this.props.timetable[v][1]] = [];
        });

        aides.forEach(aide => {
            aidesInTimetable[aide.day][aide.period].push({
                'id': aide.mis,
                'label': `${aide.firstname} ${aide.lastname}`
            })
        })

        this.setState({
            iterableTimetable: iterableTimetable,
            aidesInTimetable: aidesInTimetable,
            aidesList: aidesList
        });
    }

    synthesizeData() {
        const keys = Object.keys(this.props.timetable);

        let aidesInTimetable = this.state.aidesInTimetable;
        let aidesList = [];

        this.props.aides.forEach(v => {
            aidesList.push({
                'id': v.mis,
                'label': `${v.firstname} ${v.lastname}`
            });
        })

        keys.forEach((v) => {
            aidesInTimetable[this.props.timetable[v][0]] ? void (0) : aidesInTimetable[this.props.timetable[v][0]] = {};

            aidesInTimetable[this.props.timetable[v][0]][this.props.timetable[v][1]].forEach((t, i) => {
                let found = false;
                aidesList.forEach(a => {
                    if (a.id === t.id) {
                        found = true;
                    }
                })

                if (!found) {
                    aidesInTimetable[this.props.timetable[v][0]][this.props.timetable[v][1]].splice(i);
                    // API: remove aide from time
                }
            })
        });

        this.setState({
            aidesInTimetable: aidesInTimetable,
            aidesList: aidesList
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.aides.length !== this.props.aides.length) {
            this.synthesizeData();
        }
    }

    removeAide(id, day, period) {
        let a = this.state.aidesInTimetable

        a[day][period].forEach((v, i) => {
            if (v.id === id) {
                a[day][period].splice(i, 1);
                this.setState({
                    aidesInTimetable: a
                })
            }
        })

        removeAideFromTimetable({
            id: this.state.id,
            mis: id,
            period: period,
            day: day
        })
    }

    render() {
        return (
            <>
                {this.state.aidesList.length < 1 ? <p>
                    There are no Teacher Aides in this class.
                </p> :
                    <>
                            <ReactSortable
                                list={this.state.aidesList}
                                setList={() => { }}
                                swapThreshold={0}
                                group={{ name: "clone", pull: "clone" }}
                                clone={item => ({ ...item })}
                                className={'aideBox'}
                            >
                                {this.state.aidesList.map((aide) => (
                                    <div className={'aideItem handle'}>
                                        <Link to={`/aide/${aide.id}`}>
                                            {aide.label} ({aide.id})
                                        </Link>
                                    </div>
                                ))}
                            </ReactSortable>

                        <div className={"aideBox"}>
                            {this.state.iterableTimetable.map(c => (
                                <div className={"dayItem"} key={c.day + c.period}>
                                    <p className={'min'}>{c.day} - {c.period}</p>
                                    <ReactSortable
                                        className={'dragZone'}
                                        list={this.state.aidesInTimetable[c.day][c.period]}
                                        draggable={'.none'}
                                        setList={(newState) => {
                                            let currentAides = this.state.aidesInTimetable;

                                            let newAidesList = [];
                                            let insertTheseAides = [];

                                            newState.forEach(v => {
                                                let add = true;
                                                newAidesList.forEach(a => {
                                                    if (a.id === v.id) {
                                                        add = false;
                                                    }
                                                })

                                                if (add) {
                                                    newAidesList.push(v);
                                                    let newAide = true;
                                                    currentAides[c.day][c.period].forEach(aide => {
                                                        if (v.id === aide.id) {
                                                            newAide = false;
                                                        }
                                                    })

                                                    if (newAide) {
                                                        insertTheseAides.push(v.id);
                                                    }
                                                }
                                            });

                                            currentAides[c.day][c.period] = newAidesList;

                                            this.setState({
                                                aidesInTimetable: currentAides
                                            })

                                            insertTheseAides.forEach(aide => {
                                                addAideToTimetable({
                                                    id: this.state.id,
                                                    mis: aide,
                                                    period: c.period,
                                                    day: c.day
                                                });
                                            })
                                        }}

                                        group={{ name: "clone", pull: "clone" }}
                                        clone={item => ({ ...item })}
                                    >
                                        {this.state.aidesInTimetable[c.day][c.period].map((item) => (
                                            <div key={item.id} className={'aideItem'}>
                                                {item.label}
                                                <button onClick={() => this.removeAide(item.id, c.day, c.period)}>x</button>
                                            </div>
                                        ))}
                                    </ReactSortable>
                                </div>
                            ))}
                        </div>
                    </>
                }
            </>
        );
    }
}