import { Component, OnInit } from '@angular/core';
import lottery from '../lottery-interface'

@Component({
  selector: 'lottery-game',
  template: `
    <p>
      {{manager}}
    </p>
  `,
  styles: []
})
export class LotteryComponent implements OnInit {
  manager: any;
  constructor() { }

  async ngOnInit() {
    this.manager = await lottery.methods.manager().call();
  }

}
