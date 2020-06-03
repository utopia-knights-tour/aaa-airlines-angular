import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../../_services/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  navbarOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  home() {
    let route = ["/login"];
    if (
      this.authService.currentUserValue &&
      this.authService.currentUserValue.role
    ) {
      switch (this.authService.currentUserValue.role) {
        case "customer":
          route = ["/customer/flights"];
          break;
        case "counter":
          route = ["/counter"];
          break;
        case "agent":
          route = ["/agent"];
          break;
      }
    }
    this.router.navigate(route);
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  loggedIn() {
    return this.authService.currentUserValue;
  }

  isCustomer() {
    return this.authService.currentUserValue.role === 'customer';
  }

  logout() {
    this.authService.logout();
  }
}
