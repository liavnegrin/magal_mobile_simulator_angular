import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginResponse } from "src/app/model/LoginResponse";
import { AlertService } from "src/app/services/alert.service";
import { ConfigurationService } from "src/app/services/configuration.service";
import { LoginService } from "src/app/services/login.service";
import { CamerasPanelComponent } from "../cameras-panel/cameras-panel.component";

@Component({
    selector: 'app-login',
    templateUrl: './login-component.html',
    styleUrls: ['./login-component.css']
})
export class LoginComponent{
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    res: any;
    isFormMode:boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,       
        private alertService: AlertService,
        private loginservice: LoginService,
        private configService: ConfigurationService) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    }
        
    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }
  
    async touchIdStart(){
        let config = await this.configService.loadConfiguration();
        console.log("touchIdStart", config.userName, config.password);
        this.loginservice
            .login(config.userName, config.password)
            .subscribe((data)=>{
                if(data != null){
                    this.res = data;
                    this.alertService.success(data.Status.toString());
                    console.log(data);               
                    this.router.navigate(['events']);
                }
                this.loading = false;
        });
    }

    loginByForm(){
        this.isFormMode = true;
    }
    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            //return;
        }

        this.loading = true;  

        this.loginservice.login(this.f['username'].value, this.f['password'].value).subscribe((data)=>{
            if(data != null){
                this.res = data;
                this.alertService.success(data.Status.toString());
                console.log(data);               
                this.router.navigate(['video']);
            }
            this.loading = false;
        });

    /*  this.authenticationService.login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }); */
    }
}