import { Component, OnInit } from '@angular/core';
import lottery from '../lottery-interface';
import web3 from '../web3';

@Component({
  selector: 'lottery-game',
  template: `
    <div>
      <p>the game manager: {{manager}}</p>
      <p>number of players: {{ players?.length }}</p>
      <p>prize amount: {{ balance }}</p>
    </div>
  `,
  styles: []
})
export class LotteryComponent implements OnInit {
  manager: any;
  players: any[];
  balance: any;

  constructor() {}

  async ngOnInit() {
    this.manager = await lottery.methods.manager().call();
    this.players = await lottery.methods.getPlayers().call();
    this.balance = await web3.eth.getBalance(lottery.options.address);
    this.balance = web3.utils.fromWei(this.balance, 'ether');
  }

}
