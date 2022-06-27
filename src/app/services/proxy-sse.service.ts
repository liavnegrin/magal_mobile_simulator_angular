import { Injectable } from '@angular/core';
import { ServerEventConnect, ServerEventJoin, ServerEventLeave, ServerEventMessage, ServerEventsClient, ServerEventUpdate } from '@servicestack/client';
import { SseMessage } from '../model/SseMessage';
import { EventStatus } from '../model/EventHeader';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ProxySseService {

  constructor(private loginServive: LoginService) {   
      this.OnInit();
}

callbacks: {[type:string ]: sseMessageCallback} = {};

OnInit(): void {
    //this.callbacks.Add([key]= "g", ()=>  console.log("ProxySseService > ServerEventsClient start..."))

    this.loginServive.SSEChannels$.subscribe(channels=>{
        if(channels != null){
            console.log("ProxySseService > ServerEventsClient start...");
            const client = new ServerEventsClient("http://localhost:2000/", channels, {
                handlers: {
                    onConnect: (sub:ServerEventConnect) => {  // Successful SSE connection
                        console.log("You've connected! welcome " + sub.displayName);
                    },
                    onJoin: (msg:ServerEventJoin) => {        // User has joined subscribed channel
                        console.log("Welcome, " + msg.displayName);
                    },
                    onLeave: (msg:ServerEventLeave) => {      // User has left subscribed channel
                        console.log(msg.displayName + " has left the building");
                    },
                    onUpdate: (msg:ServerEventUpdate) => {    // User channel subscription was changed
                        console.log(msg.displayName + " channels subscription were updated");
                    },        
                    onMessage: (msg:ServerEventMessage) => {
                      console.log(msg);
                      
                      //var sseMessage = msg.body as SseMessage;
                      //if(this.callbacks[sseMessage.EntityType] != undefined)
                        //this.callbacks[sseMessage.EntityType](sseMessage);
                      //console.log(sseMessage);
                     
                    
                    
                    } // Invoked for each other message
                  
                },
              /*   receivers: 
                    //... Register any receivers
                    tv: {
                        watch: function (id) {                // Handle 'tv.watch {url}' messages 
                            var el = document.querySelector("#tv");
                            if (id.indexOf('youtu.be') >= 0) {
                                var v = splitOnLast(id, '/')[1];
                                el.innerHTML = templates.youtube.replace("{id}", v);
                            } else {
                                el.innerHTML = templates.generic.replace("{id}", id);
                            }
                            el.style.display = 'block'; 
                        },
                        off: function () {                    // Handle 'tv.off' messages
                            var el = document.querySelector("#tv");
                            el.style.display = 'none';
                            el.innerHTML = '';
                        }
                    }
                }, */
                onException: (e:Error) => {console.error(e);},                 // Invoked on each Error
                onReconnect: (e:Error) => {console.error(e);}                  // Invoked after each auto-reconnect
              })
              //.addListener("theEvent",(e:ServerEventMessage) => {}) // Add listener for pub/sub event trigger
              .start();  
        }
    });
 
//client.serviceClient.headers.append('Access-Control-Allow-Origin', '*');
//client.serviceClient.headers.set('Access-Control-Allow-Credentials', 'true');
//client.serviceClient.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//client.serviceClient.headers.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//client.start();
}



Subscribe(key: string, cllaback: sseMessageCallback){
    console.log("Subscribe: "+ key);
    this.callbacks[key] = cllaback;
}
 
}

interface sseMessageCallback {
    (cllaback: SseMessage) : Promise<void>;
  }
