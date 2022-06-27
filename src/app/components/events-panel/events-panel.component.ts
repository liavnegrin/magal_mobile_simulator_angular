import { Component, OnInit } from '@angular/core';
import { EventHeader } from 'src/app/model/EventHeader';
import { EventItem } from 'src/app/model/EventItem';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-events-panel',
  templateUrl: './events-panel.component.html',
  styleUrls: ['./events-panel.component.css']
})
export class EventsPanelComponent implements OnInit {

  events:EventItem[];
  filterTerm!: string;
  isSearchMode:boolean;

  constructor(private eventsService: EventsService) { }

  ngOnInit(): void {
    this.eventsService.events$.subscribe(param=>{
      this.events = param;
    })
  }

  expanded(header:EventHeader){
    console.log("expanded");
    header.IsExpanded = true;
    this.events
    .filter(x => x.Header !== header && x.Header.IsExpanded)
    .find(e => e.Header.IsExpanded = false)
  }

  changSearchMode(){
    this.isSearchMode = !this.isSearchMode; 
    this.filterTerm = '';
  }
}
