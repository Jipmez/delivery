import { Injectable } from "@angular/core";
@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor() {}

  get getUserLocation() {
    if (localStorage.getItem("location"))
      return localStorage.getItem("location").split("__")[0];
  }

  get getUserLocationInstantPrice() {
    return parseInt(localStorage.getItem("location").split("__")[1]);
  }

  get getUserLocationLaterPrice() {
    return parseInt(localStorage.getItem("location").split("__")[2]);
  }

  set location(value: string) {
    localStorage.setItem("location", value);
    location.reload();
  }
}
