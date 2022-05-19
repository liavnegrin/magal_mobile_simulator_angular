import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login-component';
import { LoginService } from './services/login.service';
import { HttpClientModule } from '@angular/common/http';
import { ProxyAPIServiceDef } from './services/def/proxyAPI-service-def';
import { ProxyAPIService } from './services/proxy-api.service';
import { AlartComponent } from './components/alart/alart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CamerasPanelComponent } from './components/cameras-panel/cameras-panel.component';
import { VideoRegionComponent } from './components/video-region/video-region.component';
import { EventsPanelComponent } from './components/events-panel/events-panel.component';
import { MapComponent } from './components/map/map.component';
import { NewEventComponent } from './components/new-event/new-event.component';
import { VideoPanelComponent } from './components/video-panel/video-panel.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CameraRowComponent } from './components/camera-row/camera-row.component';
import { initServicesFactory } from './init-services.factory';
import { ConfigurationService } from './services/configuration.service';
import { EventRowComponent } from './components/event-row/event-row.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';

@NgModule({
  declarations: [
    AppComponent, LoginComponent, AlartComponent,  CamerasPanelComponent, VideoRegionComponent, EventsPanelComponent, MapComponent, NewEventComponent, VideoPanelComponent, CameraRowComponent, EventRowComponent, EventDetailsComponent,  
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule
  ],
  providers: [LoginService, 
    {
      provide: ProxyAPIServiceDef,
      useClass: ProxyAPIService,     
      multi:true 
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initServicesFactory,
      deps:[ConfigurationService, LoginService],
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
