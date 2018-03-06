import web3 from './web3';

// the address of the deployed contract, received from running deploy.js. only deplyed to Rinkeby!
// const address = '0xbD31c969F2983f6a4c668d9B2cDbf992c2eC1FCF'; // v1
// const address = '0xc0BdBA2e6F29C6e5d446F8BEEf01F0943D56fA7a'; // v2
const address = '0x540b8EEe55d3B79Ea8793be5E0D33b11B694c0a0'; // v3 with previous winner

// the result of the deploy.js script. I used this for pretty print json: http://jsonprettyprint.com/
const abi = [
  {
    "constant": true,
    "inputs": [

    ],
    "name": "getPreviousWinner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [

    ],
    "name": "manager",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [

    ],
    "name": "previousWinner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [

    ],
    "name": "pickWinner",
    "outputs": [

    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [

    ],
    "name": "getPlayers",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [

    ],
    "name": "enter",
    "outputs": [

    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "players",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [

    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  }
];

export default new web3.eth.Contract(abi, address);
