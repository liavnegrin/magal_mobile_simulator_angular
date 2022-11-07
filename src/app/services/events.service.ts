import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, ignoreElements, map, Observable, switchMap } from 'rxjs';
import { EventAction, EventDetails, EventNote } from '../model/EventDetails';
import { EventHeader, EventStatus } from '../model/EventHeader';
import { EventItem } from '../model/EventItem';
import { FileAttachment } from '../model/FileAttachment';
import { SseMessage, SseMessageOperation } from '../model/SseMessage';
import { LoginService } from './login.service';
import { ProxyAPIService } from './proxy-api.service';
import { ProxySseService } from './proxy-sse.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  events : EventItem[]=[];
  events$ = new BehaviorSubject<EventItem[]>(this.events);

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
  
  this.sse.Subscribe("Magal.S3.Common.Objects.Data.EventStatusDTO", this.sseCallback );
  this.sse.Subscribe("Magal.S3.Common.Objects.Data.EventHeaderDTO", this.EventHeaderDTOSseHandler );
  this.sse.Subscribe("Magal.S3.Common.Objects.Data.EventNoteDTO", this.EventNoteDTOSseHandler );
}
 async EventNoteDTOSseHandler(msg: SseMessage): Promise<void> {
    console.log("EventNoteDTOSseHandler: " + msg);
    let notes = msg.Entities as EventNote[];
    notes.forEach(async note => {
      console.log("note.EventId: " + note.EventId);
      console.log("note.Note: " + note.Note);

      this.getEvent(note.EventId).forEach(event => this.events$.value.find(x => x.Header.Id == note.EventId)!.Details?.EventNotes.push(note))
      
        //this.events$.value.find(x => x.Header.Id == note.EventId)!.Details?.EventNotes.push(note);
      
      this.events$.next(this.events$.value);    
    });
  }
  async EventHeaderDTOSseHandler(msg: SseMessage): Promise<void> {
    console.log("EventHeaderDTOSseHandler OperationType: " + msg.OperationType);
    let headers = msg.Entities as EventHeader[];
    headers.forEach(async header => {
      console.log("header: " + header.Name);
      var item = this.events.find(x => x.Header.Id == header.Id);
      console.log("item:" + item);
      if(msg.OperationType == SseMessageOperation.Update){

        if(item == undefined)  {
          let details = await this.proxyApi.getDataAsync<EventDetails>('Events/'+header.Id+'/Details'); 
          console.log("item == undefined -> this.events.push");

          this.events.push({Header:header, Details: details});
        }
        else if(item.Details == null ){
          console.log("item.Details == undefined -> item.Details = result");

          let result = await this.proxyApi.getDataAsync<EventDetails>('Events/'+header.Id+'/Details');  
          item.Details = result;
        }
      } 
      else{
        if(item != undefined){
          const index = this.events.indexOf(item, 0);
            this.events.splice(index, 1);
        }
      }     
        //this.events$.next(this.events);    
    });

  }
async sseCallback(msg: SseMessage): Promise<void>{
  console.log(msg);
  let eStatusesDTO = msg.Entities as EventStatus[];
  console.log(eStatusesDTO);
  
  //let get = this.getEventHeaderAsync(eStatusesDTO[0].EventId);
  //console.log(get);

  //let h = await this.getEventHeaderAsync(eStatusesDTO[0].EventId);

  eStatusesDTO.forEach(async s=>{
    console.log(s.EventId);
    //let h = await this.getEventHeaderAsync(s.EventId);
    //let header = await this.getEventHeaderAsync(s.EventId);
    //let h = this.events$.value.find(x => x.Header.Id == s.EventId);

   
      //console.log(h);
    //(this.events$.value.find(x => x.Header.Id == s.EventId)!.Header as EventHeader).Status  = s;
    //header.Status  = s;
  });
}
async getEventsHeader(){
  let result = await this.proxyApi.getDataAsync<EventHeader[]>(`Events/Headers`);  
    result.forEach(h=>{
      //let header = await this.getEventHeaderAsync(s.EventId);
      //h.Id = h.Id.replace(/-/gi, '');
      //header.Status  = s;
    });
    console.log('getEventsHeader.resoponse.result', result);
    let events =  result.map<EventItem>(x=> ({Header : x, Details: null}))
    this.events$.next(events);
}
async getEventDetailsAsync(eventId:string): Promise<EventDetails>{
  console.log(eventId, this.events$.value);
  if(this.events$.value == null)
    console.log("this.events$.value == null");

  if(this.events$.value.find(x => x.Header.Id == eventId)!.Details === null ){
    let result = await this.proxyApi.getDataAsync<EventDetails>('Events/'+eventId+'/Details');  
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
  let ea = await this.proxyApi.post<EventAction>("Events/"+eventId+"/ReportAcceptEvent").toPromise()
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
  let ea = await this.proxyApi.post<EventAction>("Events/"+eventId+"/ReportArriveEvent").toPromise();
  console.log("arrive -> result", ea);
}
async done(eventId: string) {
  let ea = await this.proxyApi.post<EventAction>("Events/"+eventId+"/ReportEventDone").toPromise();
  console.log("done -> result", ea);
}
async reject(eventId: string, rejectReason: string) {
  let ea = await this.proxyApi.post<EventAction>("Events/"+eventId+"/RejectEvent", rejectReason).toPromise();
  console.log("reject -> result", ea);
}

async AddManualEvent(name: string, note: string, x: number, y: number, z: number) { 

    await this.proxyApi.post('Events/AddManualEvent', {
      "Name":"mobile",
      "Note":"mobileNote",
      "Priority":1,
      "X":1442.23701298701, "Y":-885.386363636364, "Z":0,
      "PictureLinkeditem":"ef47c120-ecf2-4515-a809-510bfde86d20"
  }).toPromise()
}

AddAttachment(eventId: string, fileToUpload: any) {    
  const formData: FormData = new FormData();
  formData.append('file', fileToUpload);
  console.log('saveFileInfo', fileToUpload);
  this.proxyApi.postFormData<string>("AddAttachment", formData)
  .subscribe(
    res => {
      var attachedFile = {
        "AttachedFileId": res,
        "MediaType": 1,
        "FileType": "",
        "FileName": ""
      };
      console.log("AddAttachment:"+res);
      this.AddNoteEvent(eventId, "note", attachedFile);
    },
    error => console.error(error),
  );
}

AddNoteEvent(eventId:string, note: string, attachedFile:FileAttachment|null) { 
  this.proxyApi.post('Events/'+eventId+'/AddNote', {
    "Note":note,
    "AttachedFile":attachedFile
  }).toPromise()
}

}
