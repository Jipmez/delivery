import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductService } from "src/app/services/product.service";
import {
  ProductModelServer,
  serverResponse,
  Category,
} from "../../models/product.model";
import { CartService } from "../../services/cart.service";
import { DataService } from "src/app/services/data.provider";
import { ToastrService } from "ngx-toastr";
declare var $;
@Component({
  selector: "mg-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
})
export class CategoriesComponent implements OnInit {
  products: ProductModelServer[] = [];
  next: any;
  prev: any;
  quantity: number = 1;
  id: any;
  name: any;
  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private ac: ActivatedRoute,
    public data: DataService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = this.ac.snapshot.paramMap.get("id");
    this.name = this.ac.snapshot.paramMap.get("name");
    this.productService
      .getProductsFromCategories(this.id)
      .subscribe((res: serverResponse) => {
        this.products = res.results;
        this.next = res?.next;
        this.prev = res?.previous;
      });
  }

  filterr(x) {
    var ts = this.products.filter((person) => {
      return person.title.toLowerCase() == x.toLowerCase();
    });
    if (ts.length < 1) return this.toast.success("No products found");
    this.products = ts;
  }

  AddProduct(id: Number) {
    this.cartService.AddProductToCart(
      id,
      $("#quantity" + id).text(),
      $("#spInst" + id).val()
    );
  }

  selectProduct(id: Number) {
    this.router.navigate(["/product", id]).then();
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
