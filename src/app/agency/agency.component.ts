import { Component, OnInit } from "@angular/core";

import { AgencyService } from "../_services/agency.service";

@Component({
  selector: "app-agency",
  templateUrl: "./agency.component.html",
  styleUrls: ["./agency.component.css"],
})
export class AgencyComponent implements OnInit {
  agency: any;
  searchName = "";
  searchAddress = "";
  searchPhone = "";
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  loading = false;

  constructor(private agencyService: AgencyService) {}

  ngOnInit(): void {
    this.getAgencyById(1);
  }

  getAgencyById(id: number) {
    this.loading = true;
    this.agencyService.getAgencyById(1).subscribe(
      (data) => {
        this.loading = false;
        this.agency = data;
        console.log(data);
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  getCustomerById(id: number) {
    console.log(id);
  }

  changePage(event: Event) {
    console.log(event);
  }
}
