import { Component, OnInit } from "@angular/core";
import { CartService } from "src/app/services/cart.service";
import { ProductService } from "src/app/services/product.service";
import { DataService } from "src/app/services/data.provider";
import {
  ProductModelServer,
  serverResponse,
  Category,
} from "../../models/product.model";
declare var $;
@Component({
  selector: "mg-shops",
  templateUrl: "./shops.component.html",
  styleUrls: ["./shops.component.scss"],
})
export class ShopsComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public data: DataService
  ) {}
  shops = [];
  quantity: number = 1;
  ngOnInit(): void {
    this.productService
      .getVendors({
        location: this.data.getUserLocation ? this.data.getUserLocation : "",
      })
      .subscribe((res) => {
        this.shops = res.results;
      });
  }

  searchVendors(x: string) {
    this.productService.searchVendors(x).subscribe((res) => {
      this.shops = res.results;
    });
  }

  AddProduct(id: Number) {
    this.cartService.AddProductToCart(
      id,
      $("#quantity" + id).text(),
      $("#spInst" + id).val()
    );
  }

  addToCart(id: Number) {
    this.cartService.AddProductToCart(id, null, $("#spInst" + id).val());
  }

  Increase(id: Number) {
    this.quantity = $("#quantity" + id).text();
    this.quantity++;

    this.quantity = $("#quantity" + id).text(this.quantity);
    console.log(this.quantity);
    /*  this.quantityInput.nativeElement.value = value.toString(); */
  }

  Decrease(id: Number) {
    this.quantity = $("#quantity" + id).text();
    this.quantity--;
    if (this.quantity < 1) this.quantity = 1;
    this.quantity = $("#quantity" + id).text(this.quantity);
    console.log(this.quantity);
    /*  this.quantityInput.nativeElement.value = value.toString(); */
  }
}
