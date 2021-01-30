import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const ADDRESS = 'http://localhost';
const PORT = 3000;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private path = ADDRESS + ':' + PORT;

  constructor(private http: HttpClient) { }

  public createUser(name: String) {
    return this.http.post(this.path + '/user/create', {name});
  }

  public findUserByName(name: String) {
    return this.http.get(this.path + '/user/findByName/' + name);
  }
}
