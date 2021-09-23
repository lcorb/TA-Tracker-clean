import React, { Component } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import fetchMetrics from '../services/metrics';

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            panel: 'TeacherAideStats',
            metrics: {
                general: {
                    classes: { total: 0, aidecount: 0, studentsInClasses: 0 }, students: { total: 0 }
                },
                student: {
                    classCount: { 'n': 0, 'classCount': 1 },
                    gender: { 'Male': 1, 'Female': 1 },
                    indigenous: {
                        "ITS": 1,
                        "I": 1,
                        "TS": 1,
                        "N": 1
                    },
                    aims: { 'AIMS': 1, 'notAIMS': 1 },
                    grade: {
                        "Prep": 0,
                        "Grade 1": 0,
                        "Grade 2": 0,
                        "Grade 3": 0,
                        "Grade 4": 0,
                        "Grade 5": 0,
                        "Grade 6": 0,
                        "Grade 7": 0,
                        "Grade 8": 0,
                        "Grade 9": 0,
                        "Grade 10": 0,
                        "Grade 11": 0,
                        "Grade 12": 0
                    }
                },
                class: {

                }
            },
            aideCoverageGraph: { data: [], options: {} },
            aimsAideCoverageGraph: { data: [], options: {} },
            indigenousAideCoverageGraph: { data: [], options: {} },
            studentClassCountGraph: { data: [], options: {} },
            studentGenderGraph: { data: [], options: {} },
            studentIndigenousGraph: { data: [], options: {} },
            studentAIMSGraph: { data: [], options: {} },
            studentGradeGraph: { data: [], options: {} },
            classStudentCountGraph: { data: [], options: {} },
            classTeacherCountGraph: { data: [], options: {} },
            classTopSubjectGraph: { data: [], options: {} },
            classBottomSubjectGraph: { data: [], options: {} },
            classGradeCountGraph: { data: [], options: {} },
        }
    }

    async componentDidMount() {
        this.setState({ loading: true });
        const metrics = await fetchMetrics();

        const aideCoverageData = {
            labels: [
                'No Aide',
                'Aide',
            ],
            datasets: [{
                data: [metrics.general[0].data, metrics.general[2].data],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                ],
                hoverBackgroundColor: [
                    '#FF6380',
                    '#36A2E0',
                ]
            }]
        };

        const aimsAideCoverageData = {
            labels: [
                'AIMS students without Aide',
                'AIMS students with Aide',
            ],
            datasets: [{
                data: [metrics.general[4].data, metrics.general[5].data],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                ],
                hoverBackgroundColor: [
                    '#FF6380',
                    '#36A2E0',
                ]
            }]
        };

        const indigenousAideCoverageData = {
            labels: [
                'Indigenous students without Aide',
                'Indigenous students with Aide',
            ],
            datasets: [{
                data: [metrics.general[6].data, metrics.general[7].data],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                ],
                hoverBackgroundColor: [
                    '#FF6380',
                    '#36A2E0',
                ]
            }]
        };

        const aideCoverageOptions = {
            title: {
                display: true,
                text: 'Classes With Teacher Aide',
                fontColor: 'white',
                fontSize: 16
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: 'white',
                    fontSize: 12
                }
            }
        };

        const aimsAideCoverageOptions = {
            title: {
                display: true,
                text: 'AIMS Students With Teacher Aide',
                fontColor: 'white',
                fontSize: 16
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: 'white',
                    fontSize: 12
                }
            }
        };

        const indigenousCoverageOptions = {
            title: {
                display: true,
                text: 'Indigenous Students With Teacher Aide',
                fontColor: 'white',
                fontSize: 16
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: 'white',
                    fontSize: 12
                }
            }
        };

        const studentClassBarOptions = {
            scales: {
                yAxes: [
                    {
                        gridLines: {
                            color: 'rgb(255,100,255,0.15)',
                        },
                        ticks: {
                            beginAtZero: true,
                            fontColor: 'white',
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Number of Students',
                            fontColor: 'white',
                            fontSize: 16,
                            fontFamily: 'consolas'
                        }
                    },
                ],
                xAxes: [
                    {
                        gridLines: {
                            color: 'rgb(255,100,255,0.15)',
                        },
                        ticks : {
                            fontColor: 'white'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Class Count',
                            fontColor: 'white',
                            fontSize: 16,
                            fontFamily: 'consolas'
                        }
                    },
                ],
            },
            title: {
                display: true,
                text: 'Number of Timetabled Classes',
                fontColor: 'white',
                fontSize: 16
            },
            legend: {
                display: false
            }
        }

        const studentClassCount = {
            labels: metrics.student.classCount.map(v => v.n),
            datasets: [
                {
                    data: metrics.student.classCount.map(v => v.studentCount),
                    backgroundColor: 'rgb(23,90,122,0.2)',
                    hoverBackgroundColor: 'rgb(23,90,122,0.5)',
                    borderColor: 'rgb(255,255,255,0.8)',
                    borderWidth: 2,
                },
            ],
        }

        const genderBarOptions = {
            title: {
                display: true,
                text: 'Gender Distribution',
                fontColor: 'white',
                fontSize: 16
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: 'white',
                    fontSize: 12
                }
            }
        }

        const studentGenderDistribution = {
            labels: ['Female', 'Male'],
            datasets: [
                {
                    data: [metrics.student.gender[0].Female, metrics.student.gender[0].Male],
                    backgroundColor: ['rgb(23,150,122,0.35)', 'rgb(150,0,122,0.35)'],
                    hoverBackgroundColor: ['rgb(23,150,122,0.5)', 'rgb(150,0,122,0.5)'],
                    borderColor: 'rgb(255,255,255,0.8)',
                    borderWidth: 2,
                },
            ],
        }

        const studentIndigenousDistribution = {
            labels: [
                'Both Aboriginal and Torres Strait Islander',
                'Aboriginal',
                'Torres Strait Islander',
                'Non-Indigenous',
            ],
            datasets: [
                {
                    data: [
                        metrics.student.indigenous[0].ITS,
                        metrics.student.indigenous[0].I,
                        metrics.student.indigenous[0].TS,
                        metrics.student.indigenous[0].N
                    ],
                    backgroundColor: ['rgb(25,25,122,0.35)', 'rgb(150,50,122,0.35)', 'rgb(255,5,120,0.35)', 'rgb(120,50,255,0.35)'],
                    hoverBackgroundColor: ['rgb(25,25,122,0.5)', 'rgb(150,50,122,0.5)', 'rgb(255,5,120,0.5)', 'rgb(120,50,255,0.5)'],
                    borderColor: 'rgb(255,255,255,0.8)',
                    borderWidth: 2,
                },
            ],
        }

        const studentIndigenousDistributionOptions = {
            title: {
                display: true,
                text: 'Indigenous and Torres Strait Islander Distribution',
                fontColor: 'white',
                fontSize: 16
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: 'white',
                    fontSize: 12
                }
            }
        };

        const studentAIMSDistribution = {
            labels: ['Not AIMS', 'AIMS'],
            datasets: [
                {
                    data: [metrics.student.aims[0].notAIMS, metrics.student.aims[0].AIMS],
                    backgroundColor: ['rgb(25,25,122,0.35)', 'rgb(150,50,122,0.35)'],
                    hoverBackgroundColor: ['rgb(25,25,122,0.5)', 'rgb(150,50,122,0.5)'],
                    borderColor: 'rgb(255,255,255,0.8)',
                    borderWidth: 2,
                },
            ],
        }

        const studenAIMSDistributionOptions = {
            title: {
                display: true,
                text: 'AIMS Distribution',
                fontColor: 'white',
                fontSize: 16
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: 'white',
                    fontSize: 12
                }
            }
        };

        const studentGradeDistribution = {
            labels: Object.keys(metrics.student.grade[0]),
            datasets: [
                {
                    data: Object.values(metrics.student.grade[0]),
                    backgroundColor: 'rgb(23,90,122,0.2)',
                    hoverBackgroundColor: 'rgb(23,90,122,0.5)',
                    borderColor: 'rgb(255,255,255,0.8)',
                    borderWidth: 2,
                },
            ],
        }

        const gradeBarOptions = {
            scales: {
                yAxes: [
                    {
                        gridLines: {
                            color: 'rgb(255,100,255,0.15)',
                        },
                        ticks: {
                            beginAtZero: true,
                            fontColor: 'white',
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Number of Students',
                            fontColor: 'white',
                            fontSize: 16,
                            fontFamily: 'consolas'
                        }
                    },
                ],
                xAxes: [
                    {
                        gridLines: {
                            color: 'rgb(255,100,255,0.15)',
                        },
                        ticks : {
                            fontColor: 'white'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Grade',
                            fontColor: 'white',
                            fontSize: 16,
                            fontFamily: 'consolas'
                        }
                    },
                ],
            },
            title: {
                display: true,
                text: 'Distribution Across Grades',
                fontColor: 'white',
                fontSize: 16
            },
            legend: {
                display: false
            }
        }

        const classStudentCount = {
            labels: metrics.class.studentCount.map(v => v.n),
            datasets: [
                {
                    data: metrics.class.studentCount.map(v => v.classCount),
                    backgroundColor: 'rgb(23,90,122,0.2)',
                    hoverBackgroundColor: 'rgb(23,90,122,0.5)',
                    borderColor: 'rgb(255,255,255,0.8)',
                    borderWidth: 2,
                },
            ],
        }

        const classStudentCountOptions = {
            scales: {
                yAxes: [
                    {
                        gridLines: {
                            color: 'rgb(255,100,255,0.15)',
                        },
                        ticks: {
                            beginAtZero: true,
                            fontColor: 'white',
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Number of Classes',
                            fontColor: 'white',
                            fontSize: 16,
                            fontFamily: 'consolas'
                        }
                    },
                ],
                xAxes: [
                    {
                        gridLines: {
                            color: 'rgb(255,100,255,0.15)',
                        },
                        ticks : {
                            fontColor: 'white'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Number of Students',
                            fontColor: 'white',
                            fontSize: 16,
                            fontFamily: 'consolas'
                        }
                    },
                ],
            },
            title: {
                display: true,
                text: 'Class Size Distribution',
                fontColor: 'white',
                fontSize: 16
            },
            legend: {
                display: false
            }
        }

        const classTeacherCount = {
            labels: metrics.class.teacherClassCount.map(v => v.classCount),
            datasets: [
                {
                    data: metrics.class.teacherClassCount.map(v => v.teacherCount),
                    backgroundColor: 'rgb(23,90,122,0.2)',
                    hoverBackgroundColor: 'rgb(23,90,122,0.5)',
                    borderColor: 'rgb(255,255,255,0.8)',
                    borderWidth: 2,
                },
            ],
        }

        const classTeacherCountOptions = {
            scales: {
                yAxes: [
                    {
                        gridLines: {
                            color: 'rgb(255,100,255,0.15)',
                        },
                        ticks: {
                            beginAtZero: true,
                            fontColor: 'white',
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Number of Teachers',
                            fontColor: 'white',
                            fontSize: 16,
                            fontFamily: 'consolas'
                        }
                    },
                ],
                xAxes: [
                    {
                        gridLines: {
                            color: 'rgb(255,100,255,0.15)',
                        },
                        ticks : {
                            fontColor: 'white'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Number of Classes',
                            fontColor: 'white',
                            fontSize: 16,
                            fontFamily: 'consolas'
                        }
                    },
                ],
            },
            title: {
                display: true,
                text: 'Teaching Load Distribution',
                fontColor: 'white',
                fontSize: 16
            },
            legend: {
                display: false
            }
        }

        const classTopSubject = {
            labels: metrics.class.topSubjectCount.map(v => v.subject),
            datasets: [
                {
                    data: metrics.class.topSubjectCount.map(v => v.count),
                    backgroundColor: 'rgb(23,90,122,0.2)',
                    hoverBackgroundColor: 'rgb(23,90,122,0.5)',
                    borderColor: 'rgb(255,255,255,0.8)',
                    borderWidth: 2,
                },
            ],
        }

        const classTopSubjectOptions = {
            scales: {
                yAxes: [
                    {
                        gridLines: {
                            color: 'rgb(255,100,255,0.15)',
                        },
                        ticks: {
                            beginAtZero: true,
                            fontColor: 'white',
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Number of Classes',
                            fontColor: 'white',
                            fontSize: 16,
                            fontFamily: 'consolas'
                        }
                    },
                ],
                xAxes: [
                    {
                        gridLines: {
                            color: 'rgb(255,100,255,0.15)',
                        },
                        ticks : {
                            fontColor: 'white'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Subject',
                            fontColor: 'white',
                            fontSize: 16,
                            fontFamily: 'consolas'
                        }
                    },
                ],
            },
            title: {
                display: true,
                text: `Top ${metrics.class.topSubjectCount.length} Subjects by Class Count`,
                fontColor: 'white',
                fontSize: 16
            },
            legend: {
                display: false
            }
        }

        const classBottomSubject = {
            labels: metrics.class.bottomSubjectCount.map(v => v.subject),
            datasets: [
                {
                    data: metrics.class.bottomSubjectCount.map(v => v.count),
                    backgroundColor: 'rgb(23,90,122,0.2)',
                    hoverBackgroundColor: 'rgb(23,90,122,0.5)',
                    borderColor: 'rgb(255,255,255,0.8)',
                    borderWidth: 2,
                },
            ],
        }

        const classBottomSubjectOptions = {
            scales: {
                yAxes: [
                    {
                        gridLines: {
                            color: 'rgb(255,100,255,0.15)',
                        },
                        ticks: {
                            beginAtZero: true,
                            fontColor: 'white',
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Number of Classes',
                            fontColor: 'white',
                            fontSize: 16,
                            fontFamily: 'consolas'
                        }
                    },
                ],
                xAxes: [
                    {
                        gridLines: {
                            color: 'rgb(255,100,255,0.15)',
                        },
                        ticks : {
                            fontColor: 'white'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Subject',
                            fontColor: 'white',
                            fontSize: 16,
                            fontFamily: 'consolas'
                        }
                    },
                ],
            },
            title: {
                display: true,
                text: `Bottom ${metrics.class.bottomSubjectCount.length} Subjects by Class Count`,
                fontColor: 'white',
                fontSize: 16
            },
            legend: {
                display: false
            }
        }

        const classGradeCount = {
            labels: metrics.class.gradeClassCount.map(v => v.grade),
            datasets: [
                {
                    data: metrics.class.gradeClassCount.map(v => v.classCount),
                    backgroundColor: 'rgb(23,90,122,0.2)',
                    hoverBackgroundColor: 'rgb(23,90,122,0.5)',
                    borderColor: 'rgb(255,255,255,0.8)',
                    borderWidth: 2,
                },
            ],
        }

        const classGradeCountOptions = {
            scales: {
                yAxes: [
                    {
                        gridLines: {
                            color: 'rgb(255,100,255,0.15)',
                        },
                        ticks: {
                            beginAtZero: true,
                            fontColor: 'white',
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Number of Classes',
                            fontColor: 'white',
                            fontSize: 16,
                            fontFamily: 'consolas'
                        }
                    },
                ],
                xAxes: [
                    {
                        gridLines: {
                            color: 'rgb(255,100,255,0.15)',
                        },
                        ticks : {
                            fontColor: 'white'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Grade',
                            fontColor: 'white',
                            fontSize: 16,
                            fontFamily: 'consolas'
                        }
                    },
                ],
            },
            title: {
                display: true,
                text: 'Class Distribution Across Grades',
                fontColor: 'white',
                fontSize: 16
            },
            legend: {
                display: false
            }
        }

        this.setState({
            loading: false,
            aideCoverageGraph: { data: aideCoverageData, options: aideCoverageOptions },
            aimsAideCoverageGraph: { data: aimsAideCoverageData, options: aimsAideCoverageOptions },
            indigenousAideCoverageGraph: { data: indigenousAideCoverageData, options: indigenousCoverageOptions },
            studentClassCountGraph: { data: studentClassCount, options: studentClassBarOptions },
            studentGenderGraph: { data: studentGenderDistribution, options: genderBarOptions },
            studentIndigenousGraph: { data: studentIndigenousDistribution, options: studentIndigenousDistributionOptions },
            studentAIMSGraph: { data: studentAIMSDistribution, options: studenAIMSDistributionOptions },
            studentGradeGraph: { data: studentGradeDistribution, options: gradeBarOptions },
            classStudentCountGraph: { data: classStudentCount, options: classStudentCountOptions },
            classTeacherCountGraph: { data: classTeacherCount, options: classTeacherCountOptions },
            classTopSubjectGraph: { data: classTopSubject, options: classTopSubjectOptions },
            classBottomSubjectGraph: { data: classBottomSubject, options: classBottomSubjectOptions },
            classGradeCountGraph: { data: classGradeCount, options: classGradeCountOptions },
            metrics: {
                general: {
                    classes: {
                        aidecount: metrics.general[2].data,
                        total: metrics.general[0].data,
                        studentsInClasses: metrics.general[3].data
                    },
                    students: {
                        total: metrics.general[1].data,
                        aims: metrics.general[4].data,
                        aimsWithAide: metrics.general[5].data,
                        indigenous: metrics.general[6].data,
                        indigenousWithAide: metrics.general[7].data
                    }
                },
                student: metrics.student
            }
        });
    }

    switchPanel(panel) {
        this.setState({ panel: panel });
    }

    fetchPanel() {
        switch (this.state.panel) {
            case 'TeacherAideStats':
                return <this.TeacherAideStats />;
            case 'StudentStats':
                return <this.StudentStats />;

            case 'ClassStats':
                return <this.ClassStats />;

            default:
                return <>Something terrible happened :(</>
        }
    }

    TeacherAideStats = () =>
        <>
            <div className={'tab-bar'}>
                <span className={'tab-item nav-selected'} onClick={() => this.switchPanel('TeacherAideStats')}>Teacher Aides</span>
                <span className={'tab-item'} onClick={() => this.switchPanel('StudentStats')}>Students</span>
                <span className={'tab-item'} onClick={() => this.switchPanel('ClassStats')}>Classes</span>
            </div>
            <div className={'graph-grid'}>
                <h3 className={'graph-grid-header'}>Teacher Aide Coverage in Classes</h3>
                <div className={'graph-grid-item'}>
                    <p>Across every class and student at BrisbaneSDE, there is a Teacher Aide coverage of {1 - (this.state.metrics.general.classes.total - this.state.metrics.general.classes.aidecount)
                        / this.state.metrics.general.classes.total}%.</p>
                    <p>This amounts to {this.state.metrics.general.classes.aidecount} classes with Teacher Aides across a total of {this.state.metrics.general.classes.total} classes.</p>
                </div>
                <div className={'graph-grid-chart'}>
                    <Pie
                        data={this.state.aideCoverageGraph.data}
                        options={this.state.aideCoverageGraph.options}
                    />
                </div>
            </div>
            <div className={'graph-grid'}>
                <div className={'graph-grid-item'}>
                    <p>There are {this.state.metrics.general.students.aims} aims students in total, with a coverage of {this.state.metrics.general.students.aimsWithAide / this.state.metrics.general.students.aims}%
            ({this.state.metrics.general.students.aimsWithAide} out of {this.state.metrics.general.students.aims}).</p>
                </div>
                <div className={'graph-grid-chart'}>
                    <Pie
                        data={this.state.aimsAideCoverageGraph.data}
                        options={this.state.aimsAideCoverageGraph.options}
                    />
                </div>
            </div>
            <div className={'graph-grid'}>
                <div className={'graph-grid-item'}>
                    <p>There are {this.state.metrics.general.students.indigenous} indigenous students in total, with a coverage of {this.state.metrics.general.students.indigenousWithAide / this.state.metrics.general.students.indigenous}%
        ({this.state.metrics.general.students.indigenousWithAide} out of {this.state.metrics.general.students.indigenous}).</p>
                </div>
                <div className={'graph-grid-chart'}>
                    <Pie
                        data={this.state.indigenousAideCoverageGraph.data}
                        options={this.state.indigenousAideCoverageGraph.options}
                    />
                </div>
            </div>
            <div className={'graph-footer'}>
                <span className={'footer-item'}>{this.state.metrics.general.students.total} Students</span>
                <span className={'footer-item'}>{this.state.metrics.general.classes.total} Classes</span>
                <span className={'footer-item'}>{this.state.metrics.general.classes.aidecount} Classes with Teacher Aides</span>
                <p className={'footer-item'}>Data current as of {Date.parse()}</p>
            </div>
        </>

    StudentStats = () =>
        <>
            <div className={'tab-bar'}>
                <span className={'tab-item'} onClick={() => this.switchPanel('TeacherAideStats')}>Teacher Aides</span>
                <span className={'tab-item nav-selected'} onClick={() => this.switchPanel('StudentStats')}>Students</span>
                <span className={'tab-item'} onClick={() => this.switchPanel('ClassStats')}>Classes</span>
            </div>
            <div className={'graph-grid'}>
                <h3 className={'graph-grid-header'}>Student Statistics</h3>
                <div className={'graph-grid-chart graph-grid-big'}>
                    <Bar
                        data={this.state.studentClassCountGraph.data}
                        options={this.state.studentClassCountGraph.options}
                    />
                </div>
            </div>
            <div className={'graph-grid'}>
                <div className={'graph-grid-chart graph-grid-big'}>
                    <Pie
                        data={this.state.studentGenderGraph.data}
                        options={this.state.studentGenderGraph.options}
                    />
                </div>
            </div>
            <div className={'graph-grid'}>
                <div className={'graph-grid-chart graph-grid-big'}>
                    <Pie
                        data={this.state.studentIndigenousGraph.data}
                        options={this.state.studentIndigenousGraph.options}
                    />
                </div>
            </div>
            <div className={'graph-grid'}>
                <div className={'graph-grid-chart graph-grid-big'}>
                    <Pie
                        data={this.state.studentAIMSGraph.data}
                        options={this.state.studentAIMSGraph.options}
                    />
                </div>
            </div>
            <div className={'graph-grid'}>
                <div className={'graph-grid-chart graph-grid-big'}>
                    <Bar
                        data={this.state.studentGradeGraph.data}
                        options={this.state.studentGradeGraph.options}
                    />
                </div>
            </div>
            <div className={'graph-footer'}>
                <span className={'footer-item'}>{this.state.metrics.general.students.total} Students</span>
            </div>
        </>

    ClassStats = () =>
        <>
            <div className={'tab-bar'}>
                <span className={'tab-item'} onClick={() => this.switchPanel('TeacherAideStats')}>Teacher Aides</span>
                <span className={'tab-item'} onClick={() => this.switchPanel('StudentStats')}>Students</span>
                <span className={'tab-item nav-selected'} onClick={() => this.switchPanel('ClassStats')}>Classes</span>
            </div>
            <div className={'graph-grid'}>
                <h3 className={'graph-grid-header'}>Class Statistics</h3>
                <div className={'graph-grid-item'}>
                    <p></p>
                </div>
                <div className={'graph-grid-chart graph-grid-big'}>
                    <Bar
                        data={this.state.classStudentCountGraph.data}
                        options={this.state.classStudentCountGraph.options}
                    />
                </div>
            </div>
            <div className={'graph-grid'}>
                <div className={'graph-grid-chart graph-grid-big'}>
                    <Bar
                        data={this.state.classTeacherCountGraph.data}
                        options={this.state.classTeacherCountGraph.options}
                    />
                </div>
            </div>
            <div className={'graph-grid'}>
                <div className={'graph-grid-chart graph-grid-big'}>
                    <Bar
                        data={this.state.classTopSubjectGraph.data}
                        options={this.state.classTopSubjectGraph.options}
                    />
                </div>
            </div>
            <div className={'graph-grid'}>
                <div className={'graph-grid-chart graph-grid-big'}>
                    <Bar
                        data={this.state.classBottomSubjectGraph.data}
                        options={this.state.classBottomSubjectGraph.options}
                    />
                </div>
            </div>
            <div className={'graph-grid'}>
                <div className={'graph-grid-chart graph-grid-big'}>
                    <Bar
                        data={this.state.classGradeCountGraph.data}
                        options={this.state.classGradeCountGraph.options}
                    />
                </div>
            </div>
            <div className={'graph-footer'}>
                <span className={'footer-item'}>:(</span>
            </div>
        </>

    render() {
        return (
            <div className={'graph-container'}>
                <h1 className={'graph-header'}>Statistics</h1>
                {this.fetchPanel()}
                {/* <p>There are {this.state.metrics.students.total} students across the school taking {this.state.metrics.classes.studentsInClasses} classes.</p>
                <p>Classes have an average of {
                    Math.trunc(100 * (this.state.metrics.classes.studentsInClasses / this.state.metrics.classes.total)) / 100
                } students, and students take an average of {
                        Math.trunc(100 * (this.state.metrics.students.total / this.state.metrics.classes.total)) / 100
                    } classes.</p> */}
            </div>
        );
    }
}