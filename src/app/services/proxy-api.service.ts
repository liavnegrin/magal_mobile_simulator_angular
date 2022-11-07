
import { HttpClient, HttpHeaders  } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, lastValueFrom, map, Observable, Subject, switchMap, tap } from "rxjs";
import { CameraItem } from "../model/CameraItem";
import { AlertService } from "./alert.service";
import { ConfigurationService } from "./configuration.service";
import { LoginService } from "./login.service";


@Injectable({
  providedIn: 'root'
})
export class ProxyAPIService {
  
  
  constructor(
    private login : LoginService,
    private http: HttpClient,
    private configuration: ConfigurationService){ 
      
    }

  /* getData<T>() : Observable<T>{    
    
    let httpOptions = {
      headers: new HttpHeaders({ 
        'session': this.login.sessionId,
      });
      return this.http.get<T>(`http://localhost:9009/FortisServer/WebApiService/REST/Cameras/Lite`, httpOptions);
   /*  console.log('getdate');
    this.login.sessionId$.subscribe(sessionId=>{
      console.log('getdate', sessionId);
        let httpOptions = {
          headers: new HttpHeaders({ 
            'session': sessionId,
      })
  };

  var resoponse = this.http.get<CameraItemDTO>(`http://localhost:9009/FortisServer/WebApiService/REST/Cameras/Lite`, httpOptions);  
  resoponse.subscribe(result =>{
    console.log('resoponse.result', result);

  }) 
    })    
  } 
   */
  getData<T>(relativeUrl: string) : Observable<T>{
    let httpOptions = {
      headers: new HttpHeaders({ 
        'Authorization': `session ${this.login.sessionId$.value ?? ""}`
      })
    };

    var resoponse = this.http.get<T>(this.configuration.baseApiUrl + relativeUrl, httpOptions);  

    return resoponse;
  }
  getDataAsync<T>(relativeUrl: string) : Promise<T>{
    let httpOptions = {
      headers: new HttpHeaders({ 
        'Authorization': `session ${this.login.sessionId$.value ?? ""}`
      })
    };

    var resoponse = this.http.get<T>(this.configuration.baseApiUrl + relativeUrl, httpOptions);  
    return lastValueFrom(resoponse);
  }

  post<T>(relativeUrl: string, body:any | null = null) : Observable<T>{
    let httpOptions = {
      headers: new HttpHeaders({ 
        'Authorization': `session ${this.login.sessionId$.value ?? ""}`,
        'Content-Type': 'application/json'
      })
    };
    var json = JSON.stringify(body);
    var url = this.configuration.baseApiUrl + relativeUrl;
    console.log(url,json);
    var resoponse = this.http.post<T>(url, json, httpOptions);  

    return resoponse;
  }
  post2(relativeUrl: string, body:any | null = null) : Observable<object>{
    let httpOptions = {
      headers: new HttpHeaders({ 
        'Authorization': `session ${this.login.sessionId$.value ?? ""}`,
        'Content-Type': 'application/json'
      })
    };
    var json = JSON.stringify(body);
    var url = this.configuration.baseApiUrl + relativeUrl;
    console.log(this.login.sessionId$.value ,url,body);
    var resoponse = this.http.post(url, body, httpOptions);  
    //var resoponse = this.http.post<T>(url, json, httpOptions);  

    return resoponse;
  }
  postFormData<T>(relativeUrl: string, body:FormData) : Observable<T>{
    let httpOptions = {
      headers: new HttpHeaders({ 
        'Authorization': `session ${this.login.sessionId$.value ?? ""}`
      })
    };
    var url = this.configuration.baseApiUrl + relativeUrl;
    console.log(url,body, httpOptions);

    var resoponse = this.http.post<T>(this.configuration.baseArchivedApiUrl + relativeUrl, body, httpOptions);  

    return resoponse;
  }

  public downloadExcelFile() {
    const url = '"http://localhost:9009/FortisServer/WebApiService/REST/GetFileAttachment/\"BodyPart_6f1e13f7-5047-4c57-a475-ec76a4cd581e\""';
    const encodedAuth = window.localStorage.getItem('encodedAuth');
    
    return this.http.get(url, { headers: new HttpHeaders({
      'Authorization': 'Basic ' + encodedAuth,
      'Content-Type': 'application/octet-stream',
      }), responseType: 'blob'}).pipe (
      tap (
        // Log the result or error
        data => console.log('You received data'),
        error => console.log(error)
      )
     );
    }  
}
