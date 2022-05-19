import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventHeader } from 'src/app/model/EventHeader';
import { EventItem } from 'src/app/model/EventItem';

@Component({
  selector: 'app-event-row',
  templateUrl: './event-row.component.html',
  styleUrls: ['./event-row.component.css']
})
export class EventRowComponent implements OnInit {

  @Input()
  header:EventHeader | null;
  
  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  openDetails(){
    this.route.navigate(['event-details', this.header!.Id]);
  } 
}
