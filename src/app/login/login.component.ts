import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { AuthService } from "../_services/auth.service";
import { StoreService } from '../_services/store.service';

@Component({ templateUrl: "login.component.html" })
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private storeService: StoreService,
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.role == "customer") {
            this.authService.getCustomerByUserIdAndAddToLocalStorage(data.userId)
            .subscribe(customer => this.storeService.setStore(customer));
            this.returnUrl = "/flights";
          } else if (data.role == "counter") {
            this.returnUrl = "/counter";
          } else if (data.role == "agent" && data.agencyId) {
            this.storeService.setStore({agencyId: data.agencyId })
            this.returnUrl = `/agency`;
          }
          this.router.navigate([this.returnUrl]);
        },
        (error) => {
          this.loading = false;
        }
      );
  }
}
