import { Component, OnInit } from '@angular/core';

import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService) { }

  loggedIn = this.authService.isLoggedIn;

  ngOnInit() {
  }
}
