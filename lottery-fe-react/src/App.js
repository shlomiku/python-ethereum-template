import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = { manager: ''};

    }

    // when the component is loaded to the page
    async componentDidMount() {
        // note: we don't need to specify the 'from' field inside the call method because
        const manager = await lottery.methods.manager().call();
        this.setState({manager});

    }

    render() {
        return (
            <div>
            <p> our manager: {this.state.manager} </p>
            </div>
    );
    }
}

export default App;
