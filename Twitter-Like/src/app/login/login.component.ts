import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import {Router} from "@angular/router"
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // DECLARE VARIABLES
  public name: String;
  public password: String;
  private editTextName: HTMLElement;
  private nameFeedback: HTMLElement;
  private editTextPassword: HTMLElement;
  private passwordFeedback: HTMLElement;

  constructor(private apiService: ApiService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    // INIT VARIABLES
    this.name = "";
    this.password = "";
    this.editTextName = document.getElementById("editTextName");
    this.nameFeedback = document.getElementById('nameFeedback');
    this.editTextPassword = document.getElementById('editTextPassword');
    this.passwordFeedback = document.getElementById('passwordFeedback');

    // ONCLICK
    this.editTextName.onclick = () => {
      if(this.editTextName.classList.contains('is-invalid')) {
        this.editTextName.classList.remove('is-invalid');
        this.nameFeedback.classList.add('d-none');
        this.name = "";
      }
    }
    this.editTextPassword.onclick = () => {
      if(this.editTextPassword.classList.contains('is-invalid')) {
        this.editTextPassword.classList.remove('is-invalid');
        this.passwordFeedback.classList.add('d-none');
        this.password = "";
      }
    }
  }

  /**
   * try to log in an user
   * @param name : the name af the user
   * @param password : the password
   */
  public login(name: String, password: String) {
    // check if vorm is valid
    if(this.formIsValid()) {
      // try to login
      this.apiService.login(name, password)
        .subscribe(
          // login success
          res => {
            console.log(res);
          },
          // login fail
          (err: HttpErrorResponse) => {
            if(err.status == 401) {
              // wrong password
              this.editTextPassword.classList.add('is-invalid');
              this.passwordFeedback.classList.remove('d-none');
            }
            if(err.status == 404) {
              // user not founded
              this.editTextName.classList.add('is-invalid');
              this.nameFeedback.innerHTML = "user not founded";
              this.nameFeedback.classList.remove('d-none');
            }
          }
        );
    }
  }

  /**
   * check if the form is valid
   * return a boolean
   */
  public formIsValid(): Boolean {
    let isValid = true;
    if(this.name == "") {
      this.editTextName.classList.add('is-invalid');
      this.nameFeedback.innerHTML = "enter a name";
      this.nameFeedback.classList.remove('d-none');
      isValid = false;
    }
    if(this.password == "") {
      this.editTextPassword.classList.add('is-invalid');
      this.passwordFeedback.classList.remove('d-none');
      isValid =  false;
    }
    return isValid;
  }
}
