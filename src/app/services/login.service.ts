import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponseMessage } from '../model/ApiResponseMessage';
import { catchError, map } from 'rxjs/operators';
import { AlertService } from './alert.service';
import { LoginResponse } from '../model/LoginResponse';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { ProxySseService } from './proxy-sse.service';
import { MobileUserInfo } from '../model/MobileUserInfo';
import { Router } from '@angular/router';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userName:string;
  password:string;

  ApiServerAvailable$ = new BehaviorSubject<boolean>(false);
  looperPeriodicUpdate: boolean;
  sessionId$ = new BehaviorSubject<string | null>(null);
  isLoggined$ = new BehaviorSubject<boolean>(false);
  SSEChannels$ = new BehaviorSubject<string[] | null>(null);

  constructor(
    private alertService: AlertService,   
    private http: HttpClient,
    private route: Router,
    private configuration: ConfigurationService) { 
      console.log("login constructor -> startLoopPeriodicUpdate");     
      this.startLoopPeriodicUpdate();
      this.ApiServerAvailable$.subscribe(isAvailable =>{
        console.log("ApiServerAvailableChanged", isAvailable, this.userName);
        if(isAvailable){
          if(this.userName != null){
            this.loginAsync(this.userName, this.password);
          }
          else{
            //this.route.navigate(['']);
          }
        }       
      });  
     }

     async initialize(username:string, password:string) {
      this.userName = username;
      this.password = password;
      await this.loginAsync(username, password);
    }    
    
  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  getSessionId(): Observable<string | null>{
    return this.sessionId$;
  }  

  loginAsync(username:string, password:string): Promise<LoginResponse| null | undefined>{
    return this.login(username, password).toPromise();
  }
  login(username:string, password:string): Observable<LoginResponse| null>{
    console.log("send login", username, password);
    var response = this.http.post<LoginResponse>(this.configuration.baseApiUrl + 'Login', { "userName": username, "password": password, mode: 1 });
    return response.pipe(
      map(result => {
        this.isLoggined$.next(true);
        this.userName = username;
        this.password = password;
        this.configuration.saveConfiguration([{key: "userName", value: username},{ key: "password", value: password}]);
        console.log('sessionId$.next', result.SessionId);
        this.alertService.success("login success - Status: " + result.Status);
        this.sessionId$.next(result.SessionId);
        this.startLoopPeriodicUpdate();
        this.SSEChannels$.next(result.SSEChannels);
        return result;
      }),
      catchError(error =>{
        this.isLoggined$.next(false);
        this.sessionId$.next(null);
        this.alertService.error("login error");
        return of(null);
      })
    );
 }

 async startLoopPeriodicUpdate(){
  this.looperPeriodicUpdate = true;
  while(this.looperPeriodicUpdate){
    let httpOptions = {
      headers: new HttpHeaders({ 
        'session': this.sessionId$.value ?? "",
      })
    };    
    this.http
        .post<MobileUserInfo[]>(this.configuration.baseApiUrl + 'Mobile/PeriodicUpdate', {"Latitude":"-59", "Longitude":"12", "State":"1"}, httpOptions,)
        .subscribe({
          next: (v) =>{ 
            //console.log(v); 
            //this.alertService.success("PeriodicUpdate success");
            this.changeApiServerAvailable(true);
          },
          error: (e) => {
             console.error(e); 
             //this.alertService.error("PeriodicUpdate error");
             if(e.status == 0){
               //this.alertService.error("Offline mode");
               console.error("Offline mode"); 
               this.changeApiServerAvailable(false);
              }
             else if(e.status == 401){
               //this.alertService.error("Online mode - and logout");
               console.error("Online mode - and logout"); 
               this.changeApiServerAvailable(true);
              }
            },
        });      
      await this.sleep(5000);
   }
 }
 changeApiServerAvailable(value:boolean){
   if((value && !this.ApiServerAvailable$.value)||
       (!value && this.ApiServerAvailable$.value)){
         console.log("changeApiServerAvailable", value);
         this.ApiServerAvailable$.next(value);
       }
  }
/*   httpOptions = {
    headers: new HttpHeaders(
      { 
        'Access-Control-Allow-Origin': 'http://localhost:9009',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
      })
  };
 */
  /* encryptedPassword(password:string){
    let clearText = '123456';
    let encryptionKey = CryptoJS.enc.Utf8.parse('secret key string');
    let salt = CryptoJS.enc.Base64.parse('SXZhbiBNZWR2ZWRldg=='); // this is the byte array in .net fiddle
      
    let iterations = 1000; // https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.rfc2898derivebytes?view=netcore-3.1
    let keyAndIv = CryptoJS.PBKDF2(encryptionKey, salt, { keySize: 256/32 + 128/32, iterations: iterations, hasher: CryptoJS.algo.SHA1 }); // so PBKDF2 in CryptoJS is direct in that it
    // always begins at the beginning of the password, whereas the .net
    // implementation offsets by the last length each time .GetBytes() is called
    // so we had to generate a Iv + Salt password and then split it
    let hexKeyAndIv = CryptoJS.enc.Hex.stringify(keyAndIv);

    let key = CryptoJS.enc.Hex.parse(hexKeyAndIv.substring(0, 64));
    let iv = CryptoJS.enc.Hex.parse(hexKeyAndIv.substring(64, hexKeyAndIv.length));

    // As you're using Encoding.Unicde in .net, we have to use CryptoJS.enc.Utf16LE here.
    let encryptedStr = CryptoJS.AES.encrypt(CryptoJS.enc.Utf16LE.parse(clearText), key, {iv: iv}).toString();

    console.log(encryptedStr)
  } */


}


