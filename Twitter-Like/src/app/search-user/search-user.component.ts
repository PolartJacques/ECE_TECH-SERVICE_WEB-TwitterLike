import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UserInterfaceMin } from '../interfaces';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss']
})
export class SearchUserComponent implements OnInit {

  public searchBarInput;
  public usersFounded: UserInterfaceMin[];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  public search() {
    this.apiService.findUsersByNameLike(this.searchBarInput)
      .subscribe((users: UserInterfaceMin[]) => {
        // success : save users founded
        this.usersFounded = users;
      }, (error: HttpErrorResponse) => alert(`something went wrong :( \n ${error.status} : ${error.statusText}`));
  }

}
