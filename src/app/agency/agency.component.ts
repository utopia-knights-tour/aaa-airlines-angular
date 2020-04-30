import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AgencyService } from "../_services/agency.service";
import { CustomerSearchComponent } from "../customer-search/customer-search.component";

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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.agencyId = +params["agencyId"];
    });
    this.getAgencyById(this.agencyId);
  }

  getAgencyById(id: number) {
    this.loading = true;
    this.agencyService.getAgencyById(1).subscribe(
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
