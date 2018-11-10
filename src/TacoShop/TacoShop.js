import React, {Component} from 'react'
import { Button, Card, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

import './TacoShop.css'

class Manu extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        let selected = this.props.selected;
        if(selected === ""){
            selected = "Select your " + this.props.element + " here!"
        }
        this.state = {dropdownOpen: false, selected: selected};
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    select(name) {
        this.setState({selected: name});
        this.props.updateFunc(this.props.element, name);
    }

    render() {
        return (
            <Dropdown size="sm" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle color="white" caret>
                    {this.state.selected}
                </DropdownToggle>
                <DropdownMenu  className="dropdown-manu" right>
                    <DropdownItem header>{this.props.element}</DropdownItem>
                    {this.props.items.map((item, key)=>
                        <DropdownItem onClick={()=>this.select(item.name)} key={key}>{item.name}</DropdownItem>)}
                </DropdownMenu>
            </Dropdown>
        );
    }
}

let Taco = ({shell, base, mixin, condiment, seasoning, removeFunc}) =>
    (
        <Card outline body className="taco m-3">
            <div className="row">
                <div className="col-5">
                    <h4 className="taco-part mt-1">Shell:</h4>
                    <h4 className="taco-part">Base Layer:</h4>
                    <h4 className="taco-part">Mixin:</h4>
                    <h4 className="taco-part">Condiment:</h4>
                    <h4 className="taco-part">Seasoning:</h4></div>
                <div className="col">
                    <h4 className="taco-part mt-1">{shell}</h4>
                    <h4 className="taco-part">{base}</h4>
                    <h4 className="taco-part">{mixin}</h4>
                    <h4 className="taco-part">{condiment}</h4>
                    <h4 className="taco-part">{seasoning}</h4></div>
                </div>
            <Button onClick={removeFunc} className="mt-3 ml-3" color="danger">Remove</Button>
        </Card>

    );


let TacoBuilder = ({taco, shell, base, mixin, condiment, seasoning, updateFunc, confirmFunc}) =>{
    return (
        <Card outline body className="taco m-3">
            <div className="row">
            <div className="col-5">
                <h4 className="taco-part mt-1">Shell:</h4>
                <h4 className="taco-part">Base Layer:</h4>
                <h4 className="taco-part">Mixin:</h4>
                <h4 className="taco-part">Condiment:</h4>
                <h4 className="taco-part">Seasoning:</h4></div>
            <div className="col">
                <div className="mb-2"><Manu updateFunc={updateFunc} element="shell" items={shell} selected={taco.shell}/></div>
                <div className="my-2"><Manu updateFunc={updateFunc} element="baseLayer" items={base} selected={taco.baseLayer}/></div>
                <div className="my-2"><Manu updateFunc={updateFunc} element="mixin" items={mixin} selected={taco.mixin}/></div>
                <div className="my-2"><Manu updateFunc={updateFunc} element="condiment" items={condiment} selected={taco.condiment}/></div>
                <div className="my-2"><Manu updateFunc={updateFunc} element="seasoning" items={seasoning} selected={taco.seasoning}/></div>
            </div></div>
            <div className="row">
                <div className="col-8"></div>
            <Button onClick={confirmFunc} className="mt-3 ml-3" color="warning">Sounds Good !</Button></div>
        </Card>

    )};

async function getTacos() {
    let taco = [];
    let l = ["shell", "baseLayer", "mixin", "condiment", "seasoning"];
    for (let i in l){
        let x = await fetch("https://tacos-ocecwkpxeq.now.sh/"+l[i]+"s");
        taco[l[i]] = await x.json();
    }
    console.log(taco);
    return taco
}

class TacoShop extends Component {

    constructor(props){
        super(props);
        this.state = ({tacos: {shell: [], baseLayer: [], mixin: [], condiment: [], seasoning: []},
            taco: {shell: "", baseLayer: "", mixin: "", condiment: "", seasoning: ""}, history: []});
        this.updateTaco = this.updateTaco.bind(this);
        this.confirmTaco = this.confirmTaco.bind(this);
        this.randomTaco = this.randomTaco.bind(this);
        this.removeTaco = this.removeTaco.bind(this);
    }

    componentDidMount() {
        getTacos().then(taco=>this.setState({tacos: taco}, ()=>console.log(this.state.tacos)));
    }

    updateTaco (name, value) {
        let newTaco = Object.assign({}, this.state.taco);
        newTaco[name] = value;
        this.setState({taco: newTaco})
    }

    removeTaco (idx) {
        let newhis = this.state.history;
        newhis.splice(idx,1);
        this.setState({history: newhis})
    }

    confirmTaco() {
        console.log(this.state.taco);
        for (let i in Object.keys(this.state.taco)){
            let key = Object.keys(this.state.taco)[i];
            if(this.state.taco[key]===""){
                alert("Don't forget to select " + key);
                return
            }
        }
        this.setState({taco: {shell: "", baseLayer: "", mixin: "", condiment: "", seasoning: ""},
        history: [this.state.taco].concat(this.state.history)})
    }

    randomTaco() {
        let newTaco = Object.assign({}, this.state.taco);
        for (let i in Object.keys(this.state.taco)){
            let key = Object.keys(this.state.taco)[i];
            newTaco[key] = this.state.tacos[key][Math.floor(Math.random()*this.state.tacos[key].length)].name;
        }
        this.setState({taco: newTaco}, ()=>this.confirmTaco())
    }

    render(){
        return (
            <div className="row">
                <div className="col">
                    <div className="row ml-3">
                        <h3 className="col-9">Make your taco~</h3>
                        <Button className="float-left" outline color="warning"
                                onClick={this.randomTaco}>Random</Button>
                    </div>
                    <TacoBuilder taco={this.state.taco}
                                 shell={this.state.tacos.shell}
                                 base={this.state.tacos.baseLayer}
                                 mixin={this.state.tacos.mixin}
                                 condiment={this.state.tacos.condiment}
                                 seasoning={this.state.tacos.seasoning}
                                 updateFunc={this.updateTaco}
                                 confirmFunc={this.confirmTaco}
                    />
                </div>
                <div className="col">
                    <h3 className="ml-3">Finished Tacos</h3>
                    {this.state.history.map((taco, key)=><Taco key={key}
                        shell={taco.shell}
                        base={taco.baseLayer}
                        mixin={taco.mixin}
                        condiment={taco.condiment}
                        seasoning={taco.seasoning}
                        removeFunc={()=>this.removeTaco(key)}
                    />)}
                </div>
            </div>
        )
    }
}

export default TacoShop