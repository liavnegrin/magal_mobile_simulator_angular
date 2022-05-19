import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, switchMap } from 'rxjs';
import { EventAction, EventDetails } from '../model/EventDetails';
import { EventHeader } from '../model/EventHeader';
import { EventItem } from '../model/EventItem';
import { LoginService } from './login.service';
import { ProxyAPIService } from './proxy-api.service';
import { ProxySseService } from './proxy-sse.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  events$ = new BehaviorSubject<EventItem[]>([]);

  constructor(
    private login : LoginService,
    private http: HttpClient,
    private proxyApi: ProxyAPIService,
    private sse: ProxySseService) {this.OnInit(); }

  OnInit() : void{
    console.log("EventsService.OnInit");
    this.login.sessionId$.subscribe(sessionId =>{
      if(sessionId != null){
        console.log("getEventsHeader", sessionId);
        this.getEventsHeader();
    }
  })    
}

async getEventsHeader(){
    var result = await this.proxyApi.getDataAsync<EventHeader[]>(`Events/Headers`);  
    //console.log('getEventsHeader.resoponse.result', result);
    let events =  result.map<EventItem>(x=> ({Header : x, Details: null}))
    this.events$.next(events);
}
async getEventDetailsAsync(eventId:string): Promise<EventDetails>{
  console.log(eventId, this.events$.value);
  if(this.events$.value == null)
    console.log("this.events$.value == null");

  if(this.events$.value.find(x => x.Header.Id == eventId)!.Details === null ){
    var result = await this.proxyApi.getDataAsync<EventDetails>('Events/'+eventId+'/Details');  
    this.events$.value.find(x => x.Header.Id == eventId)!.Details = result;
    this.events$.next(this.events$.value);
  }
  //console.log('getEventDetails.resoponse.result', result);
  return this.events$.value.find(x => x.Header.Id == eventId)!.Details as EventDetails;
}
async getEventHeaderAsync(eventId:string): Promise<EventHeader>{ 
  return this.events$.value.find(x => x.Header.Id == eventId)!.Header as EventHeader;
}
getEvent(eventId:string): Observable<EventItem>{ 
  return this.events$.pipe(
    map(evetns => evetns.find(x => x.Header.Id === eventId)),
    filter(event => !!event)
  ) as Observable<EventItem>
}
getEventHeader(eventId:string): Observable<EventHeader>{ 
  return this.getEvent(eventId).pipe(map(event => event.Header));
}
getEventDetails(eventId:string): Observable<EventDetails>{ 
  return this.getEvent(eventId).pipe(switchMap(event => this.proxyApi.getDataAsync<EventDetails>('Events/'+eventId+'/Details')));
}

async accept(eventId: string) {
  var ea = await this.proxyApi.post<EventAction>("Events/"+eventId+"/ReportAcceptEvent").toPromise()
  console.log("accept -> result", ea);
 /*  this.proxyApi.post<EventAction>("Events/"+eventId+"/ReportAcceptEvent")
  .pipe(switchMap(_ => this.getEventDetails(eventId)))
  .subscribe(details => {
    this.events$.value.find(x=> x.Header.Id == eventId)!.Details = details;
    this.events$.next(this.events$.value);
  });
  console.log('accept Method not implemented.'); */
}
async arrive(eventId: string) {
  var ea = await this.proxyApi.post<EventAction>("Events/"+eventId+"/ReportArriveEvent").toPromise();
  console.log("arrive -> result", ea);
}
async done(eventId: string) {
  var ea = await this.proxyApi.post<EventAction>("Events/"+eventId+"/ReportEventDone").toPromise();
  console.log("done -> result", ea);
}
async reject(eventId: string, rejectReason: string) {
  var ea = await this.proxyApi.post<EventAction>("Events/"+eventId+"/RejectEvent", rejectReason).toPromise();
  console.log("reject -> result", ea);
}


}
