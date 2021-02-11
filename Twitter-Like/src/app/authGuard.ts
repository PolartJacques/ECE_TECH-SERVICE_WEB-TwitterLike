import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "./services/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) {}

  async canActivate(): Promise<boolean> {
    const auth = await this.userService.isLogedIn();
    if(!auth) this.router.navigate(['/login']);
    return auth;
  }
}
