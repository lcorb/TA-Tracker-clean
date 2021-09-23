import React from 'react';
import { ToastContainer } from 'react-toastify';
import { ModalContainer } from 'reoverlay';
import './App.css';
import { StudentList } from './components/student/studentlist';
import { BSDEClassList } from './components/class/classes';
import { TeacherList } from './components/teacher/teacherlist';
import { TeacherAideList } from './components/aide/list';
import { DetailedAide } from './components/aide/detailed';
import { DetailedClass } from './components/class/detailed';
import { DetailedStudent } from './components/student/detailed';
import { DetailedTeacher } from './components/teacher/detailed';
import { Home } from './components/home';
import {
    BrowserRouter as Router,
    Route,
  } from 'react-router-dom';

import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import styled from 'styled-components';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

const Main = styled.main`
    transition: all .30s;
    margin-left: ${props => (props.expanded ? 240 : 64)}px;
`;

const button = `   
    transition: all .3s;
    position: fixed;
    background: none;
    border: none;
    color: rgb(192, 192, 192);
    padding: 8px 24px;
    font-size: 2em;
    z-index: 5;
    top: 1%;`

const BackButton = styled.button`    
    left: calc(${props => (props.expanded ? 13 : 4)}%);
    ${button}
`;

const ForwardButton = styled.button`    
    left: calc(${props => (props.expanded ? 16 : 7)}%);
    ${button}
`;

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            expanded: false
        };
    }
    toggleExpansion = (expanded) => {
        this.setState({ expanded: expanded });
    };

    render() {
        const expanded = this.state.expanded;
        return (
            <>
                <Router>
                    <Route render={({ location, history }) => (
                        <>
                            <SideNav
                                onSelect={(selected) => {
                                    const to = '/' + selected;
                                    if (location.pathname !== to) {
                                        history.push(to);
                                    }
                                    }}
                                    onToggle={this.toggleExpansion}
                                    style={ {position: 'fixed', background: 'rgb(24, 89, 124)'} }>
                                    <SideNav.Toggle />
                                <SideNav.Nav defaultSelected="">
                                    <NavItem eventKey="">
                                            <NavIcon>
                                                <p style={{ margin: 0, fontSize: '1.75em' }}>H</p>
                                            </NavIcon>
                                            <NavText>
                                                Home
                                            </NavText>
                                    </NavItem>
                                    <NavItem eventKey="aides">
                                            <NavIcon>
                                                <p style={{ margin: 0, fontSize: '1.75em' }}>TA</p>
                                            </NavIcon>
                                            <NavText>
                                                Teacher Aides
                                            </NavText>
                                    </NavItem>
                                    <NavItem eventKey="students">
                                            <NavIcon>
                                                <p style={{ margin: 0, fontSize: '1.75em' }}>S</p>
                                            </NavIcon>
                                            <NavText>
                                                Students
                                            </NavText>
                                    </NavItem>
                                    <NavItem eventKey="classes">
                                        <NavIcon>
                                            <p style={{ margin: 0, fontSize: '1.75em' }}>C</p>
                                        </NavIcon>
                                        <NavText>
                                            Classes
                                        </NavText>
                                    </NavItem>
                                    <NavItem eventKey="teachers">
                                        <NavIcon>
                                            <p style={{ margin: 0, fontSize: '1.75em' }}>T</p>
                                        </NavIcon>
                                        <NavText>
                                            Teachers
                                        </NavText>
                                    </NavItem>
                                </SideNav.Nav>
                            </SideNav>
                            <Main expanded={expanded}>
                                {/* render these once */}
                                    <ToastContainer
                                        position="top-right"
                                        autoClose={5000}
                                        hideProgressBar
                                        newestOnTop={false}
                                        closeOnClick
                                        rtl={false}
                                        pauseOnFocusLoss={false}
                                        draggable={false}
                                        pauseOnHover
                                        />
                                    <ModalContainer />
                                {/* ***************** */}
                                
                                <BackButton onClick={history.goBack} expanded={expanded}>&#8249;</BackButton>
                                <ForwardButton onClick={history.goForward} expanded={expanded}>&#8250;</ForwardButton>

                                <Route path="/" exact component={ Home } />
                                <Route path="/students" component={ StudentList } />
                                <Route path="/classes" component={ BSDEClassList } />
                                <Route path="/teachers" component={ TeacherList } />
                                <Route path="/aides" component={ TeacherAideList } />
                                <Route path="/aide/:mis" component={ DetailedAide } />
                                <Route path="/class/:code" component={ DetailedClass } />
                                <Route path="/student/eqid/:eqid" component={ DetailedStudent } />
                                <Route path="/teacher/:mis" component={ DetailedTeacher } />
                            </Main>
                        </>
                        )}
                        />
                </Router>
            </>
        )
    }
}

export default App;
