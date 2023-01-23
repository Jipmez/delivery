import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable, BehaviorSubject } from "rxjs";
import {
  ProductModelServer,
  serverResponse,
  Category,
} from "../models/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private url = environment.serverURL;

  constructor(private http: HttpClient) {}

  private messageSource: any = new BehaviorSubject("home");

  currentMessage = this.messageSource.asObservable();

  getAllProducts(x) {
    let params = x;

    Object.keys(params).forEach(
      (key) =>
        params[key] === undefined ||
        params[key] === null ||
        (params[key] === "" && delete params[key])
    );
    return this.http.get<serverResponse>(this.url + "products", {
      params: params,
    });
  }

  getSingleProduct(id: Number) {
    return this.http.get<ProductModelServer>(this.url + "product/" + id);
  }

  changeMessage(message) {
    this.messageSource.next(message);
  }

  getCategory() {
    return this.http.get<Category[]>(this.url + "category");
  }

  getProductsFromCategory(catName: String) {
    return this.http.get<ProductModelServer[]>(
      this.url + "products/category/" + catName
    );
  }

  getProductsFromVendor(id: Number) {
    return this.http.get<serverResponse>(this.url + "related-shop-items/" + id);
  }

  getProductsFromCategories(id: Number) {
    return this.http.get<serverResponse>(this.url + "related-category/" + id);
  }

  getVendors(x) {
    let params = x;
    Object.keys(params).forEach(
      (key) =>
        params[key] === undefined ||
        params[key] === null ||
        (params[key] === "" && delete params[key])
    );
    return this.http.get<serverResponse>(this.url + "shops", {
      params: params,
    });
  }

  searchVendors(x: string) {
    return this.http.get<serverResponse>(this.url + "search-shop?search=" + x);
  }
}
