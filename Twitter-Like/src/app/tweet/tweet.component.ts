import { Component, Input, OnInit } from '@angular/core';
import { TweetInterface } from '../interfaces';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent implements OnInit {

  @Input() tweet: TweetInterface;
  ownerName: String;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // find the tweet owner's name
    this.apiService.findUserById(this.tweet.ownerId)
      .subscribe((user: any) => {
        this.ownerName = user.name;
      });
  }
}
