import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CameraCategory } from 'src/app/model/CameraCategory';
import { CameraItem } from 'src/app/model/CameraItem';
import { CamerasService } from 'src/app/services/cameras.service';

@Component({
  selector: 'app-cameras-panel',
  templateUrl: './cameras-panel.component.html',
  styleUrls: ['./cameras-panel.component.css']
})
export class CamerasPanelComponent implements OnInit {

  @Input()
  filterTerm!: string;

  @Input()
  isShowByCategory!:boolean;

  cameras: CameraItem[];
  categories: CameraCategory[];
  constructor(private camerasService: CamerasService) { }

  ngOnInit(): void {
    this.camerasService.cameras$.subscribe(param=>{
      this.cameras = param;
    })
    this.camerasService.categories$.subscribe(param=>{
      this.categories = param;
    })
  }

  changeCategoryExpanded(category:CameraCategory): void{
    category.IsExpanded =!category.IsExpanded;
  }

}
