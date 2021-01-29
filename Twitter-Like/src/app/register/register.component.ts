import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { UserService } from '../user.service';
import {Router} from "@angular/router"
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  // DECLARE VARIABLE
  public name: String;
  private editTextName: HTMLElement;
  private textErrorMessage: HTMLElement;

  constructor(private ApiService: ApiService, private UserService: UserService, private router: Router) { }

  ngOnInit(): void {
    // INITIALIZE VARIABLE
    this.name = "";
    this.editTextName = document.getElementById('editTextName');
    this.textErrorMessage = document.getElementById('textErrorMessage');

    // ONCLICK
    this.editTextName.onclick = () => {
      // if form is invalid, reset it
      if(this.editTextName.classList.contains('is-invalid')) {
        this.editTextName.classList.remove('is-invalid');
        this.textErrorMessage.classList.add('d-none');
        this.name = "";
      }
    }
  }

  /**
   * register a new user
   * @param name : the name of the new user
   */
  public register(name: String) {
    this.formIsValid().then(formIsValid => {
      if(formIsValid) {
        // register the new user
        this.ApiService.createUser(name).subscribe((res: any) => {
          this.UserService.name = res.name;
          this.UserService.id = res._id;
          // redirect to home page
          this.router.navigate(['/']);
        });
      }
    });
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
    // check if the name is already taken
    const nameTaken = new Promise<Boolean>((resolve, reject) => {
      this.ApiService.findUserByName(this.name).subscribe(res => {
        if(res) {
          this.sendErrorMessage('username already taken');
          resolve(false);
        }
        resolve(true);
      });
    });
    return nameTaken;
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
