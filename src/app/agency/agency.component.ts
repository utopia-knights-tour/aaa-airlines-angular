import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AgencyService } from "../_services/agency.service";

@Component({
  selector: "app-agency",
  templateUrl: "./agency.component.html",
  styleUrls: ["./agency.component.css"],
})
export class AgencyComponent implements OnInit {
  agencyId: number;
  private sub: any;

  agency: any;
  customers: [];
  customersCount: number;
  searchName = "";
  searchAddress = "";
  searchPhone = "";
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  loading = false;

  constructor(
    private agencyService: AgencyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.agencyId = +params["agencyId"];
    });
    this.getAgencyById(this.agencyId);
    this.getCustomers();
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

  getCustomers() {
    this.loading = true;
    let requestParams = [];
    if (this.page) requestParams.push({ page: this.page });
    if (this.pageSize) requestParams.push({ pagesize: this.pageSize });
    if (this.searchName) requestParams.push({ name: this.searchName });
    if (this.searchAddress) requestParams.push({ address: this.searchAddress });
    if (this.searchPhone) requestParams.push({ phone: this.searchPhone });
    this.agencyService.getCustomers(requestParams).subscribe(
      (data) => {
        this.loading = false;
        this.customers = data["customers"];
        this.customersCount = data["customersCount"];
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  getCustomerById(id: number) {
    this.router.navigate(["/agency", this.agencyId, "customer", id]);
  }

  changePage(event: Event) {
    this.getCustomers();
  }
}
