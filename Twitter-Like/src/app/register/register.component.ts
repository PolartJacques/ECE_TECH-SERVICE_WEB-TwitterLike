import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import {Router} from "@angular/router"
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  // DECLARE VARIABLE
  public name: String;
  public password: String;
  public confirmPassword: String;
  private editTextName: HTMLElement;
  public nameFeedback: HTMLElement;
  private editTextPassword: HTMLElement;
  public passwordFeedback: HTMLElement;
  private editTextConfirmPassword: HTMLElement;
  public confirmPasswordFeedback: HTMLElement;

  constructor(private ApiService: ApiService, private UserService: UserService, private router: Router) { }

  ngOnInit(): void {
    // INITIALIZE VARIABLE
    this.name = "";
    this.password = "";
    this.confirmPassword = "";
    this.editTextName = document.getElementById('editTextName');
    this.nameFeedback = document.getElementById('nameFeedback');
    this.editTextPassword = document.getElementById('editTextPassword');
    this.passwordFeedback = document.getElementById('passwordFeedback');
    this.editTextConfirmPassword = document.getElementById('editTextConfirmPassword');
    this.confirmPasswordFeedback = document.getElementById('confirmPasswordFeedback');

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
    this.editTextConfirmPassword.onclick = () => {
      if(this.editTextConfirmPassword.classList.contains('is-invalid')) {
        this.editTextConfirmPassword.classList.remove('is-invalid');
        this.confirmPasswordFeedback.classList.add('d-none');
        this.confirmPassword = "";
      }
    }
  }

  /**
   * register a new user
   * @param name : the name of the new user
   */
  public register(name: String, password: String) {
    // check if the form is valid
    if(this.formIsValid()) {
      // register the new user
      this.ApiService.createUser(name, password).subscribe((res: any) => {
        // login the user
        this.UserService.doLogin(name, res.id, res.token);
        // redirect to home page
        this.router.navigate(['/']);
      }, (error: HttpErrorResponse) => {
        if(error.status == 409) {
          // username taken
          this.editTextName.classList.add('is-invalid');
          this.nameFeedback.innerHTML = "name already taken";
          this.nameFeedback.classList.remove('d-none');
        }
      });
    }
  }

  /**
   * check if the form is valid or not
   * return the propise of a boolean
   */
  public formIsValid(): Boolean {
    let formValid = true;
    if(this.name == "") {
      this.editTextName.classList.add('is-invalid');
      this.nameFeedback.innerHTML = 'enter a name';
      this.nameFeedback.classList.remove('d-none');
      formValid = false;
    }
    if(this.password == "") {
      this.editTextPassword.classList.add('is-invalid');
      this.passwordFeedback.classList.remove('d-none');
      formValid = false;
    } else if(this.confirmPassword != this.password) {
      this.editTextConfirmPassword.classList.add('is-invalid');
      this.confirmPasswordFeedback.classList.remove('d-none');
      formValid = false;
    }
    return formValid;
  }
}
