import React, { Component } from 'react';
import { Button, Card} from 'reactstrap';
import './Stopwatch.css';



let formatTime = (date) => {
    let days = Math.floor(date.valueOf() / 86400000);
    return days+":"+date.toISOString().substring(11,21)
};

let formatDate = (date) => (date.substring(0,24)+date.substring(33,));


let WatchFace = ({pos, start, time, other}) =>
    (
        <Card outline body className="stopWatch mb-3">
            <span className="category">Time:</span> <h1>{time}</h1>
            <p><span className="category">Location:</span> <span>{pos}</span></p>
            <p><span className="category">Start Time:</span> <span>{formatDate(start)}</span></p>
            <span>{other}</span>
        </Card>

    );

class Stopwatch extends Component {

    constructor(props) {
        super(props);
        if(!localStorage.getItem("history")) {
            localStorage.setItem("history", "[]")}
        this.state = {
            time: Date.now(),
            pos: ["Location Unavailable"],
            history: JSON.parse(localStorage.getItem("history")),
        };
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.reset = this.reset.bind(this);
        this.startTime = Date.now();
        this.isRunning = false;
    }

    updatePos() {
        if (this.state.pos[0] === "Location Unavailable"){
            this.setState({pos: ["Fetching Location..."]});
        }
        navigator.geolocation.getCurrentPosition(
            (position) => this.setState({pos:
                    [position.coords.latitude.toFixed(4),
                        position.coords.longitude.toFixed(4)]}),
            (error) => {
                console.log(error);
                this.setState({pos: ["Location Unavailable"]});
            }, {timeout: 10000})
    }

    componentDidMount() {
        this.updatePos();
        this.posTimer = setInterval(() => this.updatePos(), 5000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        clearInterval(this.posTimer);
    }

    start() {
        this.startTime = Date.now();
        this.isRunning = true;
        this.timer = setInterval(() => this.setState({ time: Date.now()}), 10);
    }

    stop() {
        if(this.isRunning){
            if (this.state.pos[0] === "Fetching Location..."){
                this.setState({pos: ["Location Unavailable"]});
            }
            this.setState({
                history: this.state.history
                    .concat([{
                        "start": new Date(this.startTime).toString(),
                        "time": formatTime(new Date(this.state.time-this.startTime)),
                        "pos": this.state.pos,
                        "stop": new Date(this.state.time).toString(),
                    }])
            }, () => {
                localStorage.setItem(
                    "history", JSON.stringify(this.state.history));
            });
            clearInterval(this.timer);
            this.isRunning = false;
        }
    }

    reset() {
        this.setState({history: []});
        localStorage.setItem("history", JSON.stringify([]))
    }

    render() {
        return (
            <div className="row">
                <div className="col mx-4">
                    <WatchFace
                        pos={this.state.pos}
                        start={new Date(this.startTime).toString()}
                        time={formatTime(new Date(this.state.time - this.startTime))}
                        other={
                            <div className="row float-right">
                                <Button className="mx-3" outline color="info" onClick={this.start}>Start</Button>
                                <Button className="mx-3" outline color="info" onClick={this.stop}>Stop</Button>
                            </div>}/>
                </div>
                <div className="col">
                    <div className="row mb-3"><h3>History</h3>
                        <Button className="mx-3 float-right" outline color="info" onClick={this.reset}>Clear History</Button>
                    </div>
                    <div>
                        {this.state.history.map((element, idx) =>
                            <WatchFace key={idx}
                                   pos={element.pos}
                                   start={element.start}
                                   time={element.time}
                                   other={<div><span className="category">Stop Time: </span><span>{formatDate(element.stop)}</span></div>}/>)}
                                   </div>
                </div>
            </div>
        )
    }
}

export default Stopwatch;