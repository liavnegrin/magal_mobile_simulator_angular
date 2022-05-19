import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-alart',
  templateUrl: './alart.component.html',
  styleUrls: ['./alart.component.css']
})
export class AlartComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
      this.subscription = this.alertService.getAlert()
          .subscribe(message => {
              switch (message && message.type) {
                  case 'success':
                      message.cssClass = 'alert alert-success';
                      break;
                  case 'error':
                      message.cssClass = 'alert alert-danger';
                      break;
              }

              this.message = message;
          });
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }
}
