import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ProductService } from "../../services/product.service";
import { ProductModelServer, Category } from "../../models/product.model";
import { map } from "rxjs/operators";
import { CartService } from "../../services/cart.service";

declare let $: any;

@Component({
  selector: "mg-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements AfterViewInit, OnInit {
  id: Number;
  product;
  thumbimages: any[] = [];
  cat: Category[] = [];
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((param: ParamMap) => {
          // @ts-ignore
          return param.params.id;
        })
      )
      .subscribe((prodId) => {
        this.id = prodId;
        this.productService.getSingleProduct(this.id).subscribe((prod) => {
          this.product = prod;
          /*  if (prod.picture !== null) {
            this.thumbimages = prod.picture.split(";");
          } */
        });
      });

    this.productService.getCategory().subscribe((res) => {
      this.cat = res;
    });
  }

  ngAfterViewInit(): void {
    // Product Main img Slick
    $("#product-main-img").slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: "#product-imgs",
    });

    // Product imgs Slick
    $("#product-imgs").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: "#product-main-img",
      responsive: [
        {
          breakpoint: 991,
          settings: {
            vertical: false,
            arrows: false,
            dots: true,
          },
        },
      ],
    });

    // Product img zoom
    var zoomMainProduct = document.getElementById("product-main-img");
    if (zoomMainProduct) {
      $("#product-main-img .product-preview").zoom();
    }
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
