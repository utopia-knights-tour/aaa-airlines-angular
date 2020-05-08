import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../_services/auth.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  home() {
    let route = ["/"];
    if (
      this.authService.currentUserValue &&
      this.authService.currentUserValue.role
    ) {
      switch (this.authService.currentUserValue.role) {
        case "customer":
          route = ["/flights"];
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
