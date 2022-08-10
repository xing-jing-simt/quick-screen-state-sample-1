import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateServiceService {

  state: string = '';

  constructor() { }

  set(state: string): void {
    console.log("state set to", state, "from state-service");
    this.state = state;
  }

  get(): string {
    return this.state;
  }
}
