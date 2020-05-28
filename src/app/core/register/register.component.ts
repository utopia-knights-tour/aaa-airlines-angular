import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { AuthService } from "../../_services/auth.service";
import { UserService } from "../../_services/user.service";
import { AgencyService } from "../../_services/agency.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  agencies: any;
  registerCustomerForm: FormGroup;
  registerAgentForm: FormGroup;
  loading = false;
  rcfSubmitted = false;
  rafSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private agencyService: AgencyService
  ) {
    //redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.getAllAgencies();
    this.registerCustomerForm = this.formBuilder.group({
      customerName: ["", Validators.required],
      customerAddress: ["", Validators.required],
      customerPhone: [
        "",
        [Validators.required, Validators.pattern('^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$')],
      ],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      role: ["", []]
    });
    this.registerAgentForm = this.formBuilder.group({
      agencyId: [null, Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  getAllAgencies() {
    this.loading = true;
    this.agencyService.getAgencies().subscribe(
      (data) => {
        this.loading = false;
        this.agencies = data;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  // convenience getter for easy access to form fields
  get rcf() {
    return this.registerCustomerForm.controls;
  }
  get raf() {
    return this.registerAgentForm.controls;
  }

  onCustomerSubmit() {
    this.rcfSubmitted = true;

    // stop here if form is invalid
    if (this.registerCustomerForm.invalid) {
      return;
    }

    this.loading = true;
    this.registerCustomerForm.value.role = "customer";
    this.userService
      .register(this.registerCustomerForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate(["/login"]);
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  onAgentSubmit() {
    this.rafSubmitted = true;

    // stop here if form is invalid
    if (this.registerAgentForm.invalid) {
      return;
    }

    this.loading = true;
    this.registerAgentForm.value.role = "agent";
    this.userService
      .register(this.registerAgentForm.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate(["/login"]);
        },
        (error) => {
          this.loading = false;
        }
      );
  }
}
