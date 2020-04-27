import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerService } from "../_services/customer.service";

@Component({
  selector: "app-counter",
  templateUrl: "./counter.component.html",
  styleUrls: ["./counter.component.css"],
})
export class CounterComponent implements OnInit {
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
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCustomersForCounter();
  }

  getCustomersForCounter() {
    this.loading = true;
    let requestParams = [];
    if (this.page) requestParams.push({ page: this.page });
    if (this.pageSize) requestParams.push({ pagesize: this.pageSize });
    if (this.searchName) requestParams.push({ name: this.searchName });
    if (this.searchAddress) requestParams.push({ address: this.searchAddress });
    if (this.searchPhone) requestParams.push({ phone: this.searchPhone });
    this.customerService.getCustomersForCounter(requestParams).subscribe(
      (data) => {
        this.loading = false;
        this.customers = data["customers"];
        this.customersCount = data["customers"].length;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  getCustomerById(id: number) {
    console.log(id);
    this.router.navigate(["/counter/customer", id]);
  }

  changePage(event: Event) {
    this.getCustomersForCounter();
  }
}
