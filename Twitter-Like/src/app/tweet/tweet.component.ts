import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { TweetInterface } from '../interfaces';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent implements OnInit {

  @Input() tweet: TweetInterface;
  ownerName: String;

  constructor(private apiService: ApiService, private userService: UserService) { }

  ngOnInit(): void {
    // find the tweet owner's name
    this.apiService.findUserById(this.tweet.ownerId)
      .subscribe((user: any) => {
        this.ownerName = user.name;
      });
  }

  public delete() {
    this.apiService.deleteTweet(this.userService.getToken(), this.tweet._id)
      .subscribe(() => {
        // success
        this.userService.feed.splice(this.userService.feed.indexOf(this.tweet), 1);
      }, (error: HttpErrorResponse) => {
        // erroor
        alert(`something went wrong :( \n ${error.status} : ${error.statusText})`);
      });
  }

  public isOurTweet() {
    return this.tweet.ownerId == this.userService.user._id;
  }

  public like() {
    this.apiService.likeTweet(this.userService.getToken(), this.tweet._id).subscribe(() => {
      if(this.tweet.isLiked) this.tweet.like--;
      else this.tweet.like++;
      this.tweet.isLiked = !this.tweet.isLiked;
    }, (error: HttpErrorResponse) => {
      alert(`something went wrong :( \n ${error.status} : ${error.statusText}`);
    });
  }
}
