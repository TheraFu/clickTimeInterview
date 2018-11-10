import React, {Component} from 'react'
import {Card} from 'reactstrap'
import './DVDStore.css'
import sw4 from './sw4.jpg'
import sw5 from'./sw5.jpg'
import sw6 from './sw6.jpg'
import {Button} from 'reactstrap'

const ITEMS = {
    "Star Wars Episode IV DVD": {"price": 20, "picture": sw4},
    "Star Wars Episode V DVD": {"price": 20, "picture": sw5},
    "Star Wars Episode VI DVD": {"price": 20, "picture": sw6},
    "Star Wars Episode IV Blu-Ray": {"price": 25, "picture": sw4},
    "Star Wars Episode V Blu-Ray": {"price": 25, "picture": sw5},
    "Star Wars Episode VI Blu-Ray": {"price": 25, "picture": sw6},
};

let ItemCard = ({name, info, addfunc}) => {
    return (
        <Card body className="storeItem mb-5 mx-5">
            <div className="row">
                <div className="col-2"> <img className="pic" src={info.picture}/></div>
                <div className="col-10">
                    <div className="row">
                        <h1 className="itemText col-10">{name}</h1>
                        <div className="col"><Button outline color="info" onClick={()=>addfunc(name)}>Add to Cart</Button></div></div>
                    <div className="row">
                        <p className="itemPrice col-10">${info.price}</p>
                    </div>
                </div>
            </div>
        </Card>
    )
};

let CartItem = ({name, info, addfunc, removefunc, deletefunc}) =>
{
    if(info.count>0){
    return (
        <Card body className="storeItem mb-5 mx-5">
            <div className="row">
                <h1 className="itemText col-9">{name}</h1>
                <div className="row col-3">
                    <div className="col float-right">
                    <Button outline color="info" onClick={()=>addfunc(name)}>+</Button>
                    <span className="mx-3">  {info.count}  </span>
                    <Button outline color="info" onClick={()=>removefunc(name)}>-</Button>
                    <Button className="ml-5" color="secondary" onClick={()=>deletefunc(name)}>X</Button></div>
                </div>
            </div>
            <div className="row">
                <p className="itemPrice col-10">${info.price}</p>
            </div>
        </Card>
    )}
    else{
        return <div></div>
    }
};


class DVDStore extends Component {

    constructor(props){
        super(props);
        let c = {};
        for (let i in Object.keys(ITEMS)){
            let key = Object.keys(ITEMS)[i];
            c[key] = {"price": ITEMS[key].price, "count": 0}
        }
        this.state = {cart: c, itemCount: 0, totalPrice: 0, PAGE: 0, discount: 0, discounts: [0,0,0]};
        this.handleAdd = this.handleAdd.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.clearCart = this.clearCart.bind(this);
    }

    handleRemove(key) {
        if(this.state.cart[key].count > 1){
            let c = Object.assign({}, this.state.cart);
            c[key].count -= 1;
            this.setState({cart: c,
                itemCount: this.state.itemCount-1,
                totalPrice: this.state.totalPrice - ITEMS[key].price},
                ()=>this.calculateDiscount())
        }
    }

    handleDelete(key) {
        let c = Object.assign({}, this.state.cart);
        let num = this.state.cart[key].count;
        c[key].count = 0;
        this.setState({cart: c, itemCount:
                this.state.itemCount-num,
            totalPrice: this.state.totalPrice - ITEMS[key].price * num},
            () => this.calculateDiscount())
    }

    handleAdd(key) {
        let c = Object.assign({}, this.state.cart);
        c[key].count += 1;
        this.setState({cart: c, itemCount: this.state.itemCount+1, totalPrice: this.state.totalPrice + ITEMS[key].price},
            () => {if(!this.state.PAGE){
                alert("You've added "+key+" to cart.\n You now have "+this.state.itemCount+" items in cart.");}
            this.calculateDiscount();
        });
    }

    clearCart(){
        let c = Object.assign({}, this.state.cart);
        for (let i in Object.keys(ITEMS)){
            let key = Object.keys(ITEMS)[i];
            c[key].count = 0
        }
        this.setState({cart: c, itemCount: 0, totalPrice: 0, discount: 0},
            ()=> {alert("Thanks for your purchase!!\n(and pls consider hiring me:))");
                this.calculateDiscount()
            })

    }

    calculateDiscount() {
        let c = JSON.parse(JSON.stringify(this.state.cart));
        let newDiscounts = [1,1,0];

        for (let i in Object.keys(ITEMS)){
            let key = Object.keys(ITEMS)[i];
            if(c[key].count===0){
                newDiscounts[0] = 0;
                if(key.includes("Blu-Ray")){
                    newDiscounts[1] = 0;
                }
            }
        }
        let newPrice = 0;
        for (let i in Object.keys(ITEMS)){
            let key = Object.keys(ITEMS)[i];
            if(newDiscounts[0]&&!this.state.discounts[0]){
                c[key].price *= 0.9
            }
            if(newDiscounts[1] && key.includes("Blu-Ray") && !this.state.discounts[1]){
                c[key].price *= 0.85
            }
            newPrice += c[key].price * c[key].count
        }
        if (this.state.itemCount>=100&&!this.state.discounts[2]){
            newDiscounts[2] = 1;
            newPrice *= 0.95
        }
        let discounted = this.state.totalPrice - newPrice;
        this.setState({discount: discounted, discounts: newDiscounts});
    }


    switchView() {
        if (this.state.PAGE === 0){
            return (
                <div>
                    <div className="row mx-5">
                        <h1 className="mb-5 col-11">Welcome to Liz's Pirate DVD Shop!</h1>
                        <Button className="my-4 float-left" outline color="warning" onClick={()=>this.setState({PAGE: 1})}>My Cart</Button>
                    </div>{Object.keys(ITEMS).map((key, idx) =>
                    <ItemCard name={key} info={ITEMS[key]} key={idx}
                              addfunc={this.handleAdd}
                              />)}

                </div>
            )
        }
        else {
            return (
                <div>
                    <div className="row mx-5">
                        <h1 className="mb-5 col-11">This is your Shopping Cart!</h1>
                        <Button className="my-4 float-left" outline color="warning" onClick={()=>this.setState({PAGE: 0})}>Back</Button>
                    </div>
                    {Object.keys(ITEMS).map((key, idx) =>
                        <CartItem name={key} info={this.state.cart[key]} key={idx}
                                  addfunc={this.handleAdd}
                                  removefunc={this.handleRemove}
                                  deletefunc={this.handleDelete}
                        />)}
                        <div className="row mx-5">
                            <h3 className="col-10">ItemCount: {this.state.itemCount}</h3>
                            <h5 className="col text-right">Discounted: ${this.state.discount.toFixed(2)}</h5>
                            <h3 className="col text-right">Total: ${(this.state.totalPrice-this.state.discount).toFixed(2)}</h3>

                        </div>
                    <Button className="mx-5 my-5 mt-2 float-right" size="lg" color="warning"
                            onClick={this.clearCart}>Buy</Button>
                </div>
            )
        }
    }

    render(){
        return (
            this.switchView()
        )
    }
}

export default DVDStore;