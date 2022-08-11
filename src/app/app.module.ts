import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ScreenComponent } from './screen/screen.component';
import { TranscribeButtonComponent } from './transcribe-button/transcribe-button.component';

@NgModule({
  declarations: [
    AppComponent,
    ScreenComponent,
    TranscribeButtonComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
