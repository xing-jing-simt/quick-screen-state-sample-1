import { Component, OnInit } from '@angular/core';
import { StateServiceService } from '../state-service.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss']
})
export class ScreenComponent implements OnInit {

  state_space: Map<string, Array<string>>;
  curr_state: string;
  next_states: Array<string>;
  entry_states: Array<string>;

  constructor(public stateService: StateServiceService) {
    this.state_space = new Map<string, Array<string>>()
    this.state_space.set("order", ["product"])
    this.state_space.set("product", ["scent", "error"]);
    this.state_space.set("scent", ["holder colour", "error"]);
    this.state_space.set("holder colour", ["message", "error"]);
    this.state_space.set("message", ["cart review", "error"]);
    this.state_space.set("cart review", ["product_edit", "scent_edit", "holder_colour_edit", "error", "complete"]);
    this.state_space.set("complete", []);
    this.curr_state = "order";
    this.next_states = this.state_space.get(this.curr_state) ?? [];
    this.entry_states = [...this.state_space.keys()]
  }

  ngOnInit(): void {
  }

  goto(state_name: string): void {
    if (!["error", "product_edit", "scent_edit", "holder_colour_edit"].includes(state_name)) {
      this.next_states = this.state_space.get(state_name) ?? [];
    } else {
      this.next_states = [this.curr_state];
    }
    this.curr_state = state_name;
    this.stateService.set(this.curr_state);
  }

}
