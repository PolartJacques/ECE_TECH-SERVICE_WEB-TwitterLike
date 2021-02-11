import { HttpErrorResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TweetInterface } from '../interfaces';
import { ApiService } from './api.service';

const JWT_TOKEN_KEY = "token.jwt";

@Injectable({
  providedIn: 'root'
})

export class UserService {

  public name: String;
  private id: String;
  public feed = new Array<TweetInterface>();

  constructor(private router: Router, private apiService: ApiService) { }

  /**
   * login the user on the client side
   * @param name : user name
   * @param id : user id
   * @param token : auth token
   */
  public doLogin(name: String, id: String, token: string) {
    // store the token
    sessionStorage.setItem(JWT_TOKEN_KEY, token);
    // store the user data
    this.name = name;
    this.id = id;
    // redirect to the home page
    this.router.navigate(['/']);
  }

  /**
   * check if the user is loged In
   * check token and it's validity
   */
  public async isLogedIn(): Promise<boolean> {
    const token = this.getToken();
    if(token) {
      return await new Promise<boolean>(resolve => {
        this.apiService.checkToken(token).subscribe(
          (res: HttpResponseBase) => resolve(res.status == 200),
          () => resolve(false))
      });
    }
    return false;
  }

  /**
   * return the token of the current user
   */
  public getToken(): String {
    return sessionStorage.getItem(JWT_TOKEN_KEY);
  }

  /**
   * load the feed of the current user
   */
  public loadFeed(): void {
    const offset = this.feed.length;
    this.apiService.getFeed(offset, this.getToken())
      .subscribe((res: Array<TweetInterface>) => {
        for(let tweet of res) this.feed.push(tweet);
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
