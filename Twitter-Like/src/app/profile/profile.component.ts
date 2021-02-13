import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { promise } from 'protractor';
import { TweetInterface, UserInterface } from '../interfaces';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  // DECLARE VARIABLES
  public userId: String;
  public user$: Promise<UserInterface>;
  public tweets = new Array<TweetInterface>();

  constructor(private route: ActivatedRoute, private apiService: ApiService, private userSrevice: UserService) { }

  ngOnInit(): void {
    // INIT VARIABLES
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.user$ = new Promise<UserInterface>((resolve, reject) => this.findUser(resolve, reject));
    this.loadTweets();
  }

  /**
   * find the user
   * @param resolve
   * @param reject
   */
  private findUser(resolve: (value: UserInterface | PromiseLike<UserInterface>) => void, reject: (reason?: any) => void) {
    this.apiService.findUserById(this.userSrevice.getToken(), this.userId)
      .subscribe((user: UserInterface) => {
        resolve(user);
      }, (error: HttpErrorResponse) => {
        reject(error.status);
        alert(`something went wrong :( \n ${error.status} : ${error.statusText}`);
      });
  }

  /**
   * load 20 more most recent tweets of the targeted user
   */
  private loadTweets() {
    this.apiService.getTweetsOfUser(this.userSrevice.getToken(), this.userId, this.tweets.length)
    .subscribe((tweets: TweetInterface[]) => {
      this.tweets = this.tweets.concat(tweets);
    });
  }

}
