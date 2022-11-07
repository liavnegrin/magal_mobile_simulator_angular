import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, map, Observable, switchMap } from 'rxjs';
import { EventDetails } from 'src/app/model/EventDetails';
import { EventHeader } from 'src/app/model/EventHeader';
import { EventItem } from 'src/app/model/EventItem';
import { EventsService } from 'src/app/services/events.service';
import { ProxyAPIService } from 'src/app/services/proxy-api.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {

  eventId:string;
  details$:Observable<EventDetails>;
  header$:Observable<EventHeader>;
  canAccept$:Observable<boolean>;
  canArrive$:Observable<boolean>;
  canDone$:Observable<boolean>;
  canReject$:Observable<boolean>;
  event :EventItem;
  
  constructor(
    private activteRoute: ActivatedRoute,
    private route: Router,
    private eventsService: EventsService,
    private proxyApi: ProxyAPIService) { }

  ngOnInit(): void {
    let id$ = this.activteRoute.params
      .pipe(map(prm => String(prm['id'])));
    
    id$.subscribe(id => this.eventId = id);      

    this.details$ =  id$.pipe(switchMap(id => this.eventsService.getEventDetails(id)));
    this.header$ =  id$.pipe(switchMap(id => this.eventsService.getEventHeader(id)));
    

    this.eventsService.events$.subscribe(param=>{
      this.event = param.find(x => x.Header.Id == this.eventId)!;
      console.log("this.event.Header.Id:"+this.event.Header.Id);
      console.log("this.event.Details!.EventNotes[0].Note:"+this.event.Details!.EventNotes[0].Note);
    })

    this.canAccept$ = this.details$.pipe(
      map(prm => prm.Commands.find(x=> x.Command == "Accepted")!.CanExecuteCommand.CanExecute));
    this.canArrive$ = this.details$.pipe(
      map(prm => prm.Commands.find(x=> x.Command == "Arrived")!.CanExecuteCommand.CanExecute));
    this.canDone$ = this.details$.pipe(
      map(prm => prm.Commands.find(x=> x.Command == "Done")!.CanExecuteCommand.CanExecute));
    this.canReject$ = this.details$.pipe(
      map(prm => prm.Commands.find(x=> x.Command == "Rejected")!.CanExecuteCommand.CanExecute));
  }

  backToPanel(){
    this.route.navigate(['events']);
  }
  reject(){
    console.log("reject");   
    this.eventsService.reject(this.eventId, "ככה בא לי");
  }
  async accept(){
    console.log("accept");   
    this.eventsService.accept(this.eventId);
  }
  arrived(){
    console.log("arrived");   
    this.eventsService.arrive(this.eventId);
  }
  done(){
    console.log("done");   
    this.eventsService.done(this.eventId);
  }

  fileToUpload: any;
  handleFileInput(e: any) {
    this.fileToUpload = e?.target?.files[0];
    this.saveFileInfo();
  }
  saveFileInfo(){
    this.eventsService.AddAttachment(this.eventId, this.fileToUpload);
  }
}