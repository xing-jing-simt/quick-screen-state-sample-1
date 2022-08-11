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
  screen_info: Map<string, string>;

  constructor(public stateService: StateServiceService) {
    this.state_space = new Map<string, Array<string>>()
    this.state_space.set("order", ["product"])
      .set("product", ["scent", "error"])
      .set("scent", ["holder colour", "error"])
      .set("holder colour", ["message", "error"])
      .set("message", ["cart review", "error"])
      .set("cart review", ["product edit", "scent edit", "holder colour edit", "error", "complete"])
      .set("complete", []);
    this.curr_state = "order";
    this.next_states = this.state_space.get(this.curr_state) ?? [];
    this.entry_states = [...this.state_space.keys()]

    this.screen_info = new Map<string, string>()
    this.screen_info.set("order", "Choices: E-Scentz, MFConnect \n\n Intents: set_product")
      .set("product", "Choices: E-Scentz, Refill \n\n Intents: set_product_type")
      .set("scent", "Choices: Lavender, Eucalyptus, Tea tree, Peppermint, Citronella \n\n Intents: set_scent")
      .set("holder colour", "Choices: White, Green, Blue \n\n Intents: set_holder_colour")
      .set("message", "Choices: 1. Greetings from SIMTech!, 2. <no message> \n\n Intents: set_message")
      .set("cart review", "to be discussed in meeting")
      .set("complete", "")
  }

  ngOnInit(): void {
  }

  goto(state_name: string): void {
    if (!["error", "product edit", "scent edit", "holder colour edit"].includes(state_name)) {
      this.next_states = this.state_space.get(state_name) ?? [];
    } else {
      this.next_states = [this.curr_state];
    }
    this.curr_state = state_name;
    this.stateService.set(this.curr_state);
  }

}
