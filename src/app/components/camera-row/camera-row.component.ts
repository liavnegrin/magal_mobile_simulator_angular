import { Component, Input, OnInit } from '@angular/core';
import { CameraItem } from 'src/app/model/CameraItem';

@Component({
  selector: 'app-camera-row',
  templateUrl: './camera-row.component.html',
  styleUrls: ['./camera-row.component.css']
})
export class CameraRowComponent implements OnInit {

  @Input()
  camera:CameraItem

  constructor() { }

  ngOnInit(): void {
  }

}
