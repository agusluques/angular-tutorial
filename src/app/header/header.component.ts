import { Component, OnInit, OnDestroy, } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  isAuth = false;
  subscription: Subscription;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.subscription = this.authService.user.subscribe(
      (user: User) => {
        this.isAuth = !!user;
      }
    )
  }

  onSaveData(){
    this.dataStorageService.saveRecipes();
  }

  onLoadData(){
    this.dataStorageService.loadRecipes().subscribe();
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
