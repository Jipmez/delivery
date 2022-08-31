import { Injectable } from "@angular/core";
import { SessionStorageService } from "angular-web-storage";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = environment.serverURL;

  constructor(
    public session: SessionStorageService,
    private http: HttpClient,
    private router: Router
  ) {}

  getToken() {
    return this.session.get("sid");
  }

  signup(x: any) {
    return this.http.post(`${this.url}register`, x);
  }

  login(x: any) {
    return this.http.post(`${this.url}login`, x);
  }

  logOut() {
    this.session.remove("sid");
    this.router.navigate([""]);
  }

  profile() {
    return this.http.get(`${this.url}profile`);
  }

  getLocation() {
    return this.http.get(`${this.url}location`);
  }

  isLoggedIn() {
    let authToken = this.session.get("sid");
    return authToken !== null ? true : false;
  }

  getUserOrder() {
    return this.http.get(this.url + "all-order-summary");
  }

  getDispatchDelivery() {
    return this.http.get(this.url + "dispatch");
  }

  ConfirmDispatchDelivery(x: any) {
    return this.http.post(`${this.url}dispatch`, x);
  }

  ChangePassword(x: any) {
    return this.http.put(`${this.url}change-password`, x);
  }
}
