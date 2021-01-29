import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { UserService } from '../user.service';
import {Router} from "@angular/router"


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // DECLARE VARIABLES
  public name: String;
  private editTextName: HTMLElement;
  private textErrorMessage: HTMLElement;

  constructor(private apiService: ApiService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    // INIT VARIABLES
    this.name = "";
    this.editTextName = document.getElementById("editTextName");
    this.textErrorMessage = document.getElementById('textErrorMessage');

    // ONCLICK
    this.editTextName.onclick = () => {
      // if form is invalid, reset it
      if(this.editTextName.classList.contains('is-invalid')) {
        this.editTextName.classList.remove('is-invalid');
        this.textErrorMessage.classList.add('d-none');
        this.name = "";
      }
    };
  }

  /**
   * try to log in an user
   * @param name : the name af the user
   */
  public login(name: String) {
    if(this.formIsValid()) {
      this.apiService.findUserByName(name).subscribe((user: any) => {
        // check if an user has been founded
        if(user) {
          this.userService.name = user.name;
          this.userService.id = user._id;
          // redirect to home page
          this.router.navigate(['/']);
        } else {
          this.sendErrorMessage('no user has been founded');
        }
      });
    }
  }

  /**
   * check if the form is valid or not
   * return the propise of a boolean
   */
  public async formIsValid(): Promise<Boolean> {
    // check if the name field is not emplty
    if(this.name == "") {
      this.sendErrorMessage('enter a name');
      return false;
    }
    return true;
  }

  /**
   * send an erreor messsage from the form
   * @param message : the error message you want to display
   */
  public sendErrorMessage(message: string) {
    this.textErrorMessage.innerHTML = message;
    this.textErrorMessage.classList.remove('d-none')
    this.editTextName.classList.add('is-invalid');
  }

}
