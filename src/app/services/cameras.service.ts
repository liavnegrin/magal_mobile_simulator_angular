import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CameraCategory } from '../model/CameraCategory';
import { CameraItem } from '../model/CameraItem';
import { CameraPreset } from '../model/CameraPreset';
import { VmsConfigure } from '../model/VmsConfigure';
import { LoginService } from './login.service';
import { ProxyAPIService } from './proxy-api.service';
import { ProxySseService } from './proxy-sse.service';

@Injectable({
  providedIn: 'root'
})
export class CamerasService {

  cameras$ = new BehaviorSubject<CameraItem[]>([]);
  categories$ = new BehaviorSubject<CameraCategory[]>([]);
  vmsConnectionString$= new BehaviorSubject<string>('');
  constructor(
    private login : LoginService,
    private http: HttpClient,
    private proxyApi: ProxyAPIService,
    private sse: ProxySseService) {this.OnInit(); }

    OnInit() : void{
      this.login.sessionId$.subscribe(sessionId =>{
        if(sessionId != null){
          console.log("CamerasService", sessionId);
          this.getCameras();
          this.subCategories();
          this.getVmsConnectionString();
      }
    })    
  }
  async getVmsConnectionString(){
    var result = await this.proxyApi.getDataAsync<string>(`Video/VmsConfigure`); 
    console.log("getVmsConnectionString", result) 
    this.vmsConnectionString$.next(result);
  }
  async getCameras(){
      var result = await this.proxyApi.getDataAsync<CameraItem[]>(`Video/Cameras/Lite`);  
      result.forEach(async x => {
        x.Presets = [{Id: '',CameraId:'', PresetName:'', PresetNumber:0}]
        x.Presets = await this.getPresets(x.Id);
      } );
      this.cameras$.next(result);
      this.categories$.value.forEach(x=> x.Cameras = this.cameras$.value.filter(c=> c.CameraCategoryId == x.Id));
      this.categories$.next(this.categories$.value);      
  }
  getPresets(id:string): Promise<CameraPreset[]>{
    var result = this.proxyApi.getDataAsync<CameraPreset[]>(`Video/Cameras/`+id+'/Presets');  
    return result;
}
  subCameras() : void{
    this.proxyApi
    .getData<CameraItem[]>(`Video/Cameras/Lite`)
    .subscribe(result =>{
      //console.log('subCameras.resoponse.result', result);
      this.cameras$.next(result);
      this.categories$.value.forEach(x=> x.Cameras = this.cameras$.value.filter(c=> c.CameraCategoryId == x.Id));
      this.categories$.next(this.categories$.value);
    }) 
  }
  subCategories() : void{
    this.proxyApi
    .getData<CameraCategory[]>(`Video/CameraCategories/Lite`)
    .subscribe(result =>{
      //console.log('subCategories.resoponse.result', result);
      result.push({Id: '00000000-0000-0000-0000-000000000000', Name: 'Defult Category', Cameras: [], IsExpanded: true});
      result.forEach(x=>{
        x.Cameras = this.cameras$.value.filter(c=> c.CameraCategoryId == x.Id);
        x.IsExpanded = true;
      });
      this.categories$.next(result);
    }) 
  }
 
}


