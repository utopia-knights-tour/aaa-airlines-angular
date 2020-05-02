import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AgencyService } from "../_services/agency.service";
import { CustomerService } from "../_services/customer.service";
import { CustomerSearchComponent } from "../customer-search/customer-search.component";
import { AuthService } from '../_services/auth.service';

@Component({
  selector: "app-agency",
  templateUrl: "./agency.component.html",
  styleUrls: ["./agency.component.css"],
})
export class AgencyComponent implements OnInit {

  private sub: any;
  agencyId: number;
  agency: any;
  loading = false;

  constructor(
    private agencyService: AgencyService,
    private customerService: CustomerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
   
    ({ agencyId: this.agencyId } = this.authService.currentUserValue);
    this.getAgencyById(this.agencyId);
  }

  getAgencyById(id: number) {
    this.loading = true;
    this.agencyService.getAgencyById(id).subscribe(
      (data) => {
        this.loading = false;
        this.agency = data;
      },
      (error) => {
        this.loading = false;
      }
    );
  }
}
