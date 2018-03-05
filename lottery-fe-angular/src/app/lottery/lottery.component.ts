import { Component, OnInit } from '@angular/core';
import lottery from '../lottery-interface';
import web3 from '../web3';
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {Validators} from "@angular/forms";

@Component({
  selector: 'lottery-game',
  template: `
    <div>
      <h4>general information</h4>
      <p>the game manager: {{manager}}</p>
      <p>number of players: {{ players?.length }}</p>
      <p>prize amount: {{ balance }}</p>
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
  `,
  styles: []
})
export class LotteryComponent implements OnInit {
  private form: FormGroup;

  manager: any;
  players: any[];
  balance: any;
  amount: number;

  constructor(private formBuilder: FormBuilder) {}

  async ngOnInit() {
    this.manager = await lottery.methods.manager().call();
    this.players = await lottery.methods.getPlayers().call();
    this.balance = await web3.eth.getBalance(lottery.options.address);
    this.balance = web3.utils.fromWei(this.balance, 'ether');

    this.form = this.formBuilder.group({
      amount: ['', [Validators.required]]
    });
  }

  onEnterGame(form: NgForm) {
    console.log("good start");
    this.amount = Number(form.value.amount);
    console.log(this.amount);
  }

}
