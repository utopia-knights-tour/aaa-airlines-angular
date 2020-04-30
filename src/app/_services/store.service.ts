import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  store;

  constructor() { }

  getStore() {
    return this.store;
  }

  setStore(store) {
    this.store = store;
  }
}
