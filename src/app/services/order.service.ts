import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  products: ProductResponseModel[] = [];
  ServerURL = environment.serverURL;

  constructor(private http: HttpClient) {}

  getSingleOrder(orderId: String) {
    return this.http
      .get<ProductResponseModel[]>(
        `${this.ServerURL}single-order-summary?ref_code=${orderId}`
      )
      .toPromise();
  }
}

interface ProductResponseModel {
  id: Number;
  title: String;
  description: String;
  price: Number;
  quantityOrdered: Number;
  image: String;
}
