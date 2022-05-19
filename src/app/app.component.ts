import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLinkActive} from '@angular/router';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isShowNav:boolean = false;
  
  constructor(private router:Router,
    private activteRoute: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.router.events
    .pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.url)      
    )
    .subscribe(url => this.isShowNav = (url == '/events' || url == '/video' || url == '/map'));
  }
}
