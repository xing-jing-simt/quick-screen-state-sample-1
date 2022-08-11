import { Component, OnInit } from '@angular/core';
import { TranscribeService } from '../transcribe.service';

@Component({
  selector: 'app-transcribe-button',
  templateUrl: './transcribe-button.component.html',
  styleUrls: ['./transcribe-button.component.scss']
})
export class TranscribeButtonComponent implements OnInit {

  textData: string;
  textDatabase: string;

  constructor(private transcribeService: TranscribeService) {
    this.textData = '';
    this.textDatabase = '';
  }

  ngOnInit(): void {
  }

  startTranscription() {
    this.transcribeService.initVosk({
      url: 'ws://127.0.0.1:2700',
      onPartial: (e) => {
        this.textData = this.textDatabase + e
      },
      onResults: (e) => {
        this.textDatabase = this.textDatabase + e + '\n';
        this.textData = this.textDatabase;
      },
      onError: console.log
    })
  }

  stopTranscription() {
    this.transcribeService.toggleWsConn();
  }

}
