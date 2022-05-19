import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {

  baseApiUrl:string = "http://localhost:9009/FortisServer/WebApiService/REST/";

  constructor(private httpClient: HttpClient) { }
  async loadConfiguration(): Promise<any> {
    console.log("loadConfiguration");
    const config = await this.httpClient
      .get('./assets/config/app.json')
      .toPromise();
    Object.assign(this, config);
    return config;
  }
  async saveConfiguration(data: {key:string, value:any}[]){
    var config = await this.loadConfiguration()
    data.forEach(kv=>{
      config[kv.key]=kv.value;
    })
  }
}