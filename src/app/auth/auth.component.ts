import { Component, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error = null;
  @ViewChild('authForm', { static: false }) authForm: NgForm;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  subcription: Subscription;

  constructor(private authService: AuthService, private router: Router, private componentFactory: ComponentFactoryResolver) { }

  ngOnInit(): void {

  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    this.isLoading = true;

    if (this.authForm.invalid) return;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode){
      authObs = this.authService.login(this.authForm.value.email, this.authForm.value.password);
    } else {
      authObs = this.authService.signup(this.authForm.value.email, this.authForm.value.password); 
    }

    authObs.subscribe(
      response => {
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error => {
        this.error = error;
        this.showErrorAlert(error);
        this.isLoading = false;
      }
    )

    this.authForm.reset();
  }

  private showErrorAlert(error){
    const alertCmpFactory = this.componentFactory.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const cmpRef = hostViewContainerRef.createComponent(alertCmpFactory);

    cmpRef.instance.message = error;
    this.subcription = cmpRef.instance.close.subscribe(() => {
      this.subcription.unsubscribe();
      hostViewContainerRef.clear()
    })
  }

  onHandleError(){
    this.error = null;
  }

  ngOnDestroy(){
    if (this.subcription) this.subcription.unsubscribe();
  }


}
