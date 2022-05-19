import { Component, OnInit } from '@angular/core';
import { CamerasService } from 'src/app/services/cameras.service';

@Component({
  selector: 'app-video-panel',
  templateUrl: './video-panel.component.html',
  styleUrls: ['./video-panel.component.css']
})
export class VideoPanelComponent implements OnInit {

  vmsConnectionString:string
  constructor(private camerasService: CamerasService) { }

   ngOnInit(): void {
    this.camerasService.vmsConnectionString$.subscribe(str => this.vmsConnectionString = str);
  }



}
