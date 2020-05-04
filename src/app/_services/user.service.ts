import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { User } from "../_models/user";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) { }

  register(user: User) {
    return this.http.post(
      `${environment.apiUrl}/signup`, user
    );
  }
}
