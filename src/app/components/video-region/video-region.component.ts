import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-region',
  templateUrl: './video-region.component.html',
  styleUrls: ['./video-region.component.css']
})
export class VideoRegionComponent implements OnInit {
 
  filterTerm!: string;
  isShowByCategory!:boolean;
  isVideoPanelMode:boolean;
  isSearchMode:boolean;

  constructor() { }

  ngOnInit(): void {
  }

  changSearchMode(){
    this.isSearchMode = !this.isSearchMode; 
    this.filterTerm = '';
  }

  chageShowListMode():void{
    this.isShowByCategory = !this.isShowByCategory;
  }
  changeVideoPanelMode(){
    this.isVideoPanelMode = !this.isVideoPanelMode;
  }
}
