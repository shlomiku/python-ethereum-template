pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;


    function Lottery() public {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > 0.01 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        // pseudo-random method. it is not secure to use in production
        /*
          now - the current time
          block - global block object
          sha3 was depracted in favor of keccak256
         */
        return uint(sha3(block.difficulty, now, players));
    }

    function pickWinner() public  {
        require (msg.sender == manager); // only the manager can call this method
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        // now let's reset the object to be able to run a new lottery.
        players = new address[](0);
    }
}
