import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'protractor';
import { TweetInterface, UserInterface } from '../interfaces';
import { ApiService } from './api.service';

const JWT_TOKEN_KEY = "token.jwt";

@Injectable({
  providedIn: 'root'
})

export class UserService {

  public user: UserInterface;
  public feed = new Array<TweetInterface>();

  constructor(private router: Router, private apiService: ApiService) { }

  /**
   * login the user on the client side
   * @param name : user name
   * @param id : user id
   * @param token : auth token
   */
  public doLogin(token: string) {
    // store the token
    sessionStorage.setItem(JWT_TOKEN_KEY, token);
    // redirect to the home page
    this.router.navigate(['/']);
  }

  /**
   * log out the user
   */
  public logout() {
    // store the token
    sessionStorage.removeItem(JWT_TOKEN_KEY);
    // redirect to the home page
    this.router.navigate(['/login']);
  }

  /**
   * check if the user is loged In
   * check token and it's validity
   */
  public async isLogedIn(): Promise<boolean> {
    const token = this.getToken();
    if(token) {
      return await new Promise<boolean>(resolve => {
        this.apiService.checkToken(token)
          .subscribe(() => {
            resolve(true);
            this.updateUserInfo();
          }, () => resolve(false));
      });
    }
    return false;
  }

  /**
   * return the token of the current user
   */
  public getToken(): string {
    return sessionStorage.getItem(JWT_TOKEN_KEY);
  }

  /**
   * get or refresh the user info stored in this service
   */
  public updateUserInfo() {
    this.apiService.getUserData(this.getToken())
      .subscribe((user: UserInterface) => {
        // success
        this.user = user;
      }, (error : HttpErrorResponse) => alert(`something went wrong :( \n ${error.status} : ${error.statusText}`));
  }

  /**
   * load the feed of the current user
   */
  public loadFeed(): void {
    const offset = this.feed.length;
    this.apiService.getFeed(offset, this.getToken())
      .subscribe((res: Array<TweetInterface>) => {
        this.feed = this.feed.concat(res);
      }, (err: HttpErrorResponse) => {
        alert('Something went wrong loading the feed :( \n' + err.status + ' : ' + err.statusText);
      });
  }

  /**
   * tweet something
   * @param message : the message to tweet
   */
  public tweet(message: String): void {
    this.apiService.tweet(message, this.getToken())
      .subscribe((tweet: TweetInterface) => {
        // success
        this.feed.unshift(tweet);
      }, () => {
        // error
        alert("something wen't wrong :(");
      })
  }
}
