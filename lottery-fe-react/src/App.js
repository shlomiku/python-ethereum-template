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
        message: '',
        isManagerAccount: false,
        previousWinner: ''
    };

    // gets the current metamask ACTIVE account.
    async getCurrentAccount() {
        // it will always return a list of 1 active account.
        const accounts = await web3.eth.getAccounts();
        return accounts[0];
    }

    async getLatestContractData() {
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
        this.setState({players, balance});
    }

    // when the component is loaded to the page
    async componentDidMount() {
        // note: we don't need to specify the 'from' field inside the call method because
        const manager = await lottery.methods.manager().call();
        const previousWinner = await lottery.methods.getPreviousWinner().call();
        await this.getLatestContractData();
        this.setState({manager, previousWinner});
    }


    onSubmit = async (event) => {
        event.preventDefault(); // prevent the default empty value
        this.setState({message: "Waiting for transaction to complete"});
        await lottery.methods.enter().send({
            from: await this.getCurrentAccount(),
            value: web3.utils.toWei(this.state.value, 'ether')
        });
        this.setState({message: "Transaction complete, welcome to the game"});
        await this.getLatestContractData();

    };

    selectWinner = async () => {
        if (this.state.players.length) {
            this.setState({message: "Wait for winner to be selected"});
            await lottery.methods.pickWinner().send({from: await this.getCurrentAccount()});
            await this.getLatestContractData();
            this.setState({message: "Winner selected. lottery reset"});
            const previousWinner = await lottery.methods.getPreviousWinner().call();
            this.setState({previousWinner});
        }
    };

    async checkIfManagerAccount() {
        const manager = await lottery.methods.manager().call();
        if (await this.getCurrentAccount() === manager) {
            if (this.state.isManagerAccount === false) {
                this.setState({isManagerAccount: true});
            }
        } else {
            if (this.state.isManagerAccount === true) {
                this.setState({isManagerAccount: false});
            }
        }
        setTimeout(() => {
            this.checkIfManagerAccount();
        }, 500);
    }

    render() {
        this.checkIfManagerAccount();
        return (
            <div>
                <h2>Welcome to the Lottery game</h2>
                <p> our manager is: {this.state.manager} </p>
                <p> number of players: {this.state.players.length} </p>
                <p> lottery amount: {web3.utils.fromWei(this.state.balance, 'ether')} ether </p>
                <button onClick={this.selectWinner} style={this.state.isManagerAccount ? {} : { display: 'none' }}>Select Winner</button>
                <p> previous winner: {this.state.previousWinner ? this.state.previousWinner: ''} </p>
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
