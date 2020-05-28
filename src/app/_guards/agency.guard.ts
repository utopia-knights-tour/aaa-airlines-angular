import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanLoad,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from "../_services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AgencyGuard implements CanActivate, CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
    ) {}

  canLoad(route: import("@angular/router").Route,
  segments: import("@angular/router").UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    if (this.authService.currentUserValue?.role === "agent") {
      return true;
    }
    this.router.navigate(["login"]);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.authService.currentUserValue?.role === "agent") {
        return true;
      }
      this.router.navigate(["login"]);
  }

}
