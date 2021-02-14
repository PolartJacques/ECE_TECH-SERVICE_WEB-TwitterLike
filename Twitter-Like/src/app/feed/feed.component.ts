import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  // DECLARE VARIABLES
  public EditTextNewTweet: HTMLElement;

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // INIT VARIABLES
    this.EditTextNewTweet = document.getElementById('editTextNewTweet');

    this.activatedRoute.params.subscribe(() => {
      this.userService.feed = [];
      this.userService.loadFeed();
    });
  }

  public getUser() {
    return this.userService;
  }

  public tweet() {
    const message = this.EditTextNewTweet.textContent;
    if(message) {
      console.log(message);
      this.userService.tweet(message);
      this.EditTextNewTweet.textContent = '';
    }
  }

}
