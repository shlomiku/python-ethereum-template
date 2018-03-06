import { Component, OnInit } from '@angular/core';
import lottery from '../lottery-interface';
import web3 from '../web3';
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {Validators} from "@angular/forms";

@Component({
  selector: 'lottery-game',
  template: `
    <div class="container">
      <div class="row">
        <div class="col col-4">
        </div>
        <div class="col col-4">
          <h4>general information</h4>
          <p>the game manager: {{manager}}</p>
          <p>number of players: {{ players?.length }}</p>
          <p>prize amount: {{ balance }}</p>
          <button *ngIf="isManagerAccount" (click)="selectWinner()" class="btn btn-success" type="submit">Choose Winner</button>
          <p>previous winner: {{previousWinner}}</p>
          <hr/>
          <h4>Do you want to play? </h4>
          <form (ngSubmit)="onEnterGame(f)" #f="ngForm">
            <div class="row">
              <div class="form-group">
                <label for="amount">enter amount to play</label>
                <input type="text" name="amount" class="form-control" ngModel required>
                ether
              </div>
              <button class="btn btn-success" type="submit">Submit</button>
            </div>
          </form>
        </div>
        <div class="col col-4">
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LotteryComponent implements OnInit {
  private form: FormGroup;

  manager: any;
  previousWinner: any;
  players: any[];
  balance: any;
  amount: string = '';
  isManagerAccount: boolean = false;

  constructor(private formBuilder: FormBuilder) {}

  async ngOnInit() {
    this.checkIfManagerAccount();
    this.previousWinner = await lottery.methods.getPreviousWinner().call();
    this.manager = await lottery.methods.manager().call();
    this.form = this.formBuilder.group({
      amount: ['', [Validators.required]]
    });
    this.getLatestContractData();
  }

  async onEnterGame(form: NgForm) {
    console.log("initiating money transfer");
    this.amount = form.value.amount;
    console.log(this.amount);
    await lottery.methods.enter().send({
      from: await this.getCurrentAccount(),
      value: web3.utils.toWei(form.value.amount, 'ether')
    });
    this.getLatestContractData();
    console.log("money transferred");
  }

  // gets the current metamask ACTIVE account.
  async getCurrentAccount() {
    // it will always return a list of 1 active account.
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  }

  async checkIfManagerAccount() {
    const manager = await lottery.methods.manager().call();
    if (await this.getCurrentAccount() === manager) {
      if (this.isManagerAccount === false) {
        this.isManagerAccount = true;
      }
    } else {
      if (this.isManagerAccount === true) {
        this.isManagerAccount = false;
      }
    }

    setTimeout(() => {
      this.checkIfManagerAccount();
    }, 500);
  }

  async getLatestContractData() {
    this.players = await lottery.methods.getPlayers().call();
    this.balance = await web3.eth.getBalance(lottery.options.address);
    this.balance = web3.utils.fromWei(this.balance, 'ether');
  }

  selectWinner = async () => {
    if (this.players.length) {
      // this.setState({message: "Wait for winner to be selected"});
      await lottery.methods.pickWinner().send({from: await this.getCurrentAccount()});
      await this.getLatestContractData();
      // this.setState({message: "Winner selected. lottery reset"});
      this.previousWinner = await lottery.methods.getPreviousWinner().call();
      this.getLatestContractData();
      console.log("winner seleceted, contract reset")
    }
  };

}
