import { Component, OnInit } from "@angular/core";
import { AgencyService } from "../../_services/agency.service";
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: "app-agency",
  templateUrl: "./agency.component.html",
  styleUrls: ["./agency.component.css"],
})
export class AgencyComponent implements OnInit {

  agencyId: number;
  agency: any;
  loading = false;

  constructor(
    private agencyService: AgencyService,
    private authService: AuthService
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
