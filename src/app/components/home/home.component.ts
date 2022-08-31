import { Component, OnInit } from "@angular/core";
import { ProductService } from "../../services/product.service";
import {
  ProductModelServer,
  serverResponse,
  Category,
} from "../../models/product.model";
import { CartService } from "../../services/cart.service";

import { Router } from "@angular/router";
import { DataService } from "src/app/services/data.provider";
declare var tidioChatApi;
declare var $;
@Component({
  selector: "mg-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  products: ProductModelServer[] = [];
  cat: Category[] = [];
  home: any;
  next: any;
  prev: any;
  quantity: number = 1;
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,

    public data: DataService
  ) {
    this.productService.currentMessage.subscribe(
      (message) => (this.home = message)
    );
  }

  ngOnInit() {
    console.log(this.data.getUserLocation);
    this.productService
      .getAllProducts({
        location: this.data.getUserLocation ? this.data.getUserLocation : "",
        page: "",
      })
      .subscribe((prods) => {
        console.log(prods);
        this.products = prods.results;
        this.next = prods.next;
        this.prev = prods.previous;
      });

    this.productService.getCategory().subscribe((res) => {
      this.cat = res;
    });
  }

  nextPage(x) {
    this.productService
      .getAllProducts({
        location: this.data.getUserLocation ? this.data.getUserLocation : "",
        page: x ? x : "",
      })
      .subscribe((prods: serverResponse) => {
        this.products = prods.results;
        this.next = prods.next;
        this.prev = prods.previous;
      });
  }

  changenav(x) {
    this.productService.changeMessage(x);
  }
  tsd() {
    /*  tidioChatApi.messageFromVisitor("Message from visitor!"); */

    tidioChatApi.open();
    /*  $crisp.push(["do", "chat:open"]);

    $crisp.push(["do", "message:send", ["text", "Hello there!"]]); */
  }

  AddProduct(id: Number) {
    this.cartService.AddProductToCart(
      id,
      this.quantity,
      $("#spInst" + id).val()
    );
  }

  selectProduct(id: Number) {
    this.router.navigate(["/product", id]).then();
  }

  addToCart(id: Number) {
    this.cartService.AddProductToCart(id, null, $("#spInst" + id).val());
  }

  Increase() {
    this.quantity++;

    console.log(this.quantity);
    /*  this.quantityInput.nativeElement.value = value.toString(); */
  }

  Decrease() {
    this.quantity--;
    if (this.quantity < 1) this.quantity = 1;
    /*  this.quantityInput.nativeElement.value = value.toString(); */
  }
}
