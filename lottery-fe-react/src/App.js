import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';


class App extends Component {
    state = {
        manager: '',
        players: [],
        balance: '',
        value: '',
        message: ''
    };

    // when the component is loaded to the page
    async componentDidMount() {
        // note: we don't need to specify the 'from' field inside the call method because
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
        this.setState({manager, players, balance});
    }
    onSubmit = async (event) => {
        event.preventDefault(); // prevent the default empty value
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        this.setState({message: "Waiting for transaction to complete"});
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.value, 'ether')
        });
        this.setState({message: "Transaction complete, welcome to the game"});

    };

    render() {
        return (
            <div>
                <h2>Welcome to the Lottery game</h2>
                <p> our manager is: {this.state.manager} </p>
                <p> number of players: {this.state.players.length} </p>
                <p> lottery amount: {web3.utils.fromWei(this.state.balance, 'ether')} ether </p>
                <hr/>
                <form onSubmit={this.onSubmit}>
                    <h4>Want to play?</h4>
                    <label>Amount of ether to enter</label>
                    <input value={this.state.value}
                           onChange={event => {
                               this.setState({value: event.target.value});
                               console.log(event.target.value);
                           }
                           }/>
                    <button>Enter</button>
                </form>
                <hr/>
                <h3>{this.state.message}</h3>
            </div>
        );
    }
}

export default App;
