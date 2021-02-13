import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { UserInterface } from '../interfaces';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-tag',
  templateUrl: './user-tag.component.html',
  styleUrls: ['./user-tag.component.scss']
})
export class UserTagComponent implements OnInit {

  // DECLARE VARIABLES
  @Input() user: UserInterface;
  public btnFollowText = "suivre";

  constructor(private userService: UserService, private apiService: ApiService) { }

  ngOnInit(): void {
    // addapt button if the user of this tag is allready followed
    if(this.user.isFollowed) this.btnFollowText = 'desabonner';
  }

  /**
   * follow or unfollow the user of this tag
   */
  public follow() {
    if(this.user.isFollowed) {
      this.apiService.unfollow(this.userService.getToken(), this.user._id)
        .subscribe(() => {
          // success
          this.userService.updateUserInfo();
          this.btnFollowText = 'suivre';
        }, (error: HttpErrorResponse) => alert(`something went wrong \n ${error.status} : ${error.statusText}`));
    } else {
      this.apiService.follow(this.userService.getToken(), this.user._id)
        .subscribe(() => {
          // success
          this.userService.updateUserInfo();
          this.btnFollowText = 'desabonner';
        }, (error: HttpErrorResponse) => alert(`something went wrong \n ${error.status} : ${error.statusText}`));
    }
  }

  /**
   * return a bollean saying if the user of this tag is the loged in user
   */
  public isOurSelf(): Boolean {
    return this.user._id == this.userService.user._id;
  }

}
