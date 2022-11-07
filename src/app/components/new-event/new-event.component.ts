import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent implements OnInit {

  constructor(private router: Router,
    private eventService: EventsService) { }

  ngOnInit(): void {
  }

  backToPanel(){
    this.router.navigate(['events']);
  }
  send(){
    this.eventService.AddManualEvent("name","note",109.757855,49.093543,0);
  }
}
