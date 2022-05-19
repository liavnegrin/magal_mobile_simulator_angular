import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CamerasPanelComponent } from './components/cameras-panel/cameras-panel.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { EventsPanelComponent } from './components/events-panel/events-panel.component';
import { LoginComponent } from './components/login/login-component';
import { MapComponent } from './components/map/map.component';
import { NewEventComponent } from './components/new-event/new-event.component';
import { VideoRegionComponent } from './components/video-region/video-region.component';

const routes: Routes = [ 
  {path: '',  redirectTo: 'login', pathMatch: 'full'},
  {path:'login' , component: LoginComponent},
  {path:'events' , component: EventsPanelComponent},
  {path:'video' , component: VideoRegionComponent},
  {path:'map' , component: MapComponent},
  {path:'new-event' , component: NewEventComponent},
  {path:'event-details/:id' , component: EventDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
