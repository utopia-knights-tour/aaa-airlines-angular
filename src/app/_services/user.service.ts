import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { User } from "../_models/user";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}

  register(user: User) {
    return this.http.post(
      "https://meksvi4fnh.execute-api.us-east-1.amazonaws.com/dev/signup",
      user
    );
  }
}
