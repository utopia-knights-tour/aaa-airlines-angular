import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../_services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.css']
})
export class CustomerSearchComponent implements OnInit {

  customers: [];
  customersCount: number;
  searchName = "";
  searchAddress = "";
  searchPhone = "";
  page = 1;
  pageSize = 10;
  loading = false;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers() {
    this.loading = true;
    let requestParams = [];
    if (this.page) requestParams.push({ page: this.page });
    if (this.pageSize) requestParams.push({ pagesize: this.pageSize });
    if (this.searchName) requestParams.push({ customerName: this.searchName });
    if (this.searchAddress) requestParams.push({ customerAddress: this.searchAddress });
    if (this.searchPhone) requestParams.push({ customerPhone: this.searchPhone });
    this.customerService.getCustomers(requestParams).subscribe(
      (data: any) => {
        this.loading = false;
        this.customers = data.customers || data.pageContent;
        this.customersCount = data.customersCount || data.totalRecords;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  getCustomerById(id: number) {
  }

  changePage(event: Event) {
    this.getCustomers();
  }

}
