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

  public getFeed(offset: Number, token: String) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + token
      })
    };
    return this.http.get(this.path + '/user/get/feed/' + offset, httpOptions);
  }

  public findUserById(id: String) {
    return this.http.get(this.path + '/user/findBy/id/' + id);
  }

  public tweet(message: String, token: String) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + token
      })
    };
    return this.http.post(this.path + '/user/tweet', {message} , httpOptions);
  }

  public checkToken(token: String) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + token
      }),
      observe: 'response' as 'body'
    };
    return this.http.get(this.path + '/checkToken', httpOptions);
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
}
