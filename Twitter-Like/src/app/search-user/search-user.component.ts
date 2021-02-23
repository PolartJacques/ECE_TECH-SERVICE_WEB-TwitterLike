import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UserInterface } from '../interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})
export class SearchUserComponent implements OnInit {

  public searchBarInput;
  public usersFounded: UserInterface[];

  // detect clic outside component to close it
  @HostListener('document:click', ['$event.target'])
  clickout(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if(!clickedInside) this.usersFounded = null;
  }

  constructor(private apiService: ApiService, private userService: UserService,private elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  public search() {
    if(this.searchBarInput) {
      this.apiService.findUsersByNameLike(this.userService.getToken(), this.searchBarInput)
      .subscribe((users: UserInterface[]) => {
        // success : save users founded
        this.usersFounded = users;
      }, (error: HttpErrorResponse) => alert(`something went wrong :( \n ${error.status} : ${error.statusText}`));
    }
  }

}
