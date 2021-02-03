import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const JWT_TOKEN_KEY = "token.jwt";

@Injectable({
  providedIn: 'root'
})

export class UserService {

  public name: String;
  private id: String;

  constructor(private router: Router) { }

  public doLogin(name: String, id: String, token: string) {
    // store the token
    sessionStorage.setItem(JWT_TOKEN_KEY, token);
    // store the user data
    this.name = name;
    this.id = id;
    // redirect to the home page
    this.router.navigate(['/']);
  }

  public isLogedIn(): boolean {
    return !!this.getToken();
  }

  public getToken(): String {
    return sessionStorage.getItem(JWT_TOKEN_KEY);
  }
}
