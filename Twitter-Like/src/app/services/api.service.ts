import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

const ADDRESS = 'http://localhost';
const PORT = 3000;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private path = ADDRESS + ':' + PORT;

  constructor(private http: HttpClient) { }

  public createUser(name: String, password: String) {
    return this.http.post(this.path + '/user/register', {name, password});
  }

  public login(name: String, password: String) {
    return this.http.post(this.path + '/user/login', {name, password});
  }

  public getFeed(offset: Number, token: string) {
    return this.http.get(this.path + '/user/get/feed/' + offset, this.setHeader(token));
  }

  public findUserById(token: string, id: String) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + token
      })
    };
    return this.http.get(this.path + '/user/findBy/id/' + id, httpOptions);
  }

  public tweet(message: String, token: string) {
    return this.http.post(this.path + '/user/tweet', {message} , this.setHeader(token));
  }

  public checkToken(token: string) {
    return this.http.get(this.path + '/checkToken', this.setHeader(token));
  }

  public deleteTweet(token: String, tweetId: String) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + token
      }),
      observe: 'response' as 'body'
    };
    return this.http.post(this.path + '/tweet/delete', {tweetId}, httpOptions);
  }

  public findUsersByNameLike(token: string, name: String) {
    return this.http.get(this.path + '/user/findBy/nameLike/' + name, this.setHeader(token));
  }

  public follow(token: string, targetId: String) {
    return this.http.put(this.path + '/user/follow', {targetId}, this.setHeader(token));
  }

  public unfollow(token: string, targetId: String) {
    return this.http.put(this.path + '/user/unfollow', {targetId}, this.setHeader(token));
  }

  public getUserData(token: string) {
    return this.http.get(this.path + '/user/get/data', this.setHeader(token));
  }

  public likeTweet(token: string, tweetId: String) {
    return this.http.put(this.path + '/tweet/like', {tweetId}, this.setHeader(token));
  }

  public getTweetsOfUser(token: string, targetId: String, offset: Number) {
    return this.http.get(this.path + '/user/get/tweets/of/' + targetId + '/' + offset, this.setHeader(token));
  }

  // PRIVATES METHODES
  private setHeader(token: string) {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + token
      })
    };
  }
}
