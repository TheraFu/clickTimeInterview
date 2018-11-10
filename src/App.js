import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Nav, NavItem, NavLink } from 'reactstrap';

import Stopwatch from './Stopwatch/Stopwatch';
import DVDStore from './DVDStore/DVDStore';
import TacoShop from './TacoShop/TacoShop';


const Header = () => (
    <div className="App-header m-3">
        <Nav tabs>
            <NavItem>
                <NavLink className="inactive" tag={Link} to="/">Home</NavLink>
            </NavItem>
            <NavItem>
                <NavLink className="inactive" tag={Link} to="/StopWatch">Question1</NavLink>
            </NavItem>
            <NavItem>
                <NavLink className="inactive" tag={Link} to="/DVDStore">Question2</NavLink>
            </NavItem>
            <NavItem>
                <NavLink className="inactive" tag={Link} to="/TacoShop">Question3</NavLink>
            </NavItem>
        </Nav>
    </div>
);


class App extends Component {

  render() {
    return (
        <Router>
            <div className="App">
                <Header />
                <div className="m-4">
                    <Route exact path="/" component={() => <h1>Hey, I'm Thera!</h1>} />
                    <Route path="/StopWatch" component={Stopwatch} />
                    <Route path="/DVDStore" component={DVDStore} />
                    <Route path="/TacoShop" component={TacoShop} />

                </div>
            </div>
        </Router>
    );
  }
}

export default App;
