import {Component, OnInit} from '@angular/core';
import { AppService } from './app.service';
import {AccountService} from "./account.service";
import {ILoginObj} from "./login-obj";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Spring WebSocket Demo with Angular 4';
  messages = [];
  errorMessage: string;
  authenticated: boolean;
  loginInProcess: boolean = false;
  loginObj: ILoginObj = {
    username: '',
    password: ''
  };

  constructor(private _appService: AppService,
              private _accountService: AccountService) {

  }


  ngOnInit(): void {
    this._appService.onMessage((message: MessageEvent) => {
      var data = message.data;
      this.messages.push(data);
      if(this.messages.length > 100) {
        this.messages.slice(0, 1);
      }
    });

    this._accountService.validate().subscribe(tokenObj => {
        this.loginObj.username = tokenObj.username;
        this.authenticated = this._accountService.authenticated;
        this._appService.connectWebsocket(this._accountService.getToken());
      },
      error => this.errorMessage = <any>error);


  }

  login(): void {
    this.loginInProcess = true;
  }

  loginConfirm(): void {
    this.loginInProcess = false;
    this._accountService.authenticate(this.loginObj).subscribe(account => {
        if(!this._accountService.authenticated){
          alert(account.error);
        } else {
          this.loginObj.password = '';
          this.authenticated = true;
          this._appService.connectWebsocket(this._accountService.getToken());
        }
      },
      error => this.errorMessage = <any>error);
  }

  loginCancel(): void {
    this.loginObj.password = '';
    this.loginInProcess = false;
  }

  logout(): void {
    this._accountService.logout().subscribe(token => {
        this.loginObj.username = '';
        this.authenticated = false;
        this._appService.closeWebsocket()
      },
      error => this.errorMessage = <any>error);
  }




}
