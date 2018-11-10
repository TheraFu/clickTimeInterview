import React, {Component} from 'react'
import {Card} from 'reactstrap'


const ITEMS = [
    {"name":"Star Wars Episode IV DVD", "price": 20, "picture": './sw4'},
    {"name":"Star Wars Episode V DVD", "price": 20, "picture": './sw5'},
    {"name":"Star Wars Episode VI DVD", "price": 20, "picture": './sw6'},
    {"name":"Star Wars Episode IV Blu-Ray", "price": 20, "picture": './sw4'},
    {"name":"Star Wars Episode V Blu-Ray", "price": 20, "picture": './sw5'},
    {"name":"Star Wars Episode VI Blu-Ray", "price": 20, "picture": './sw6'},
];

let ItemCard = (item) => {
    return (
        <Card>
            <p>item.name</p>
            <p>item.price</p>
        </Card>
    )
};



class DVDStore extends Component {

    constructor(props){
        super(props)
    }


    render(){
        return (
            <div>{ITEMS.map((item, idx) => <ItemCard item={item} key={idx}/>)}</div>
        )
    }
}