import { Component, OnInit } from "@angular/core";
import { CartService } from "../../services/cart.service";
import { CartModelServer } from "../../models/cart.model";
import { ProductService } from "../../services/product.service";
import { SessionStorageService } from "angular-web-storage";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { DataService } from "src/app/services/data.provider";
declare let $;
@Component({
  selector: "mg-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  cartData: CartModelServer;
  cartTotal: Number;
  location;
  loca;

  constructor(
    public cartService: CartService,
    private productService: ProductService,
    public auth: AuthService,
    public data: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cartTotal$.subscribe((total) => {
      this.cartTotal = total;
    });

    this.cartService.cartDataObs$.subscribe((data) => (this.cartData = data));

    this.auth.getLocation().subscribe((res) => (this.location = res));

    var header = $(".sticky-bar");
    var win = $(window);
    win.on("scroll", function () {
      var scroll = win.scrollTop();
      if (scroll < 200) {
        header.removeClass("stick");
        $(".header-style-2 .categories-dropdown-active-large").removeClass(
          "open"
        );
        $(".header-style-2 .categories-button-active").removeClass("open");
      } else {
        header.addClass("stick");
      }
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    $(".position-select").select2({
      dropdownParent: $(".choose-position"),
    });

    $(".select2-selection").css("border-radius", "0px");
    $(".select2-container").children().css("border-radius", "0px");
  }

  changenav(x) {
    this.productService.changeMessage(x);
  }

  toggleNav() {
    let ele = document.getElementById("mobi");
    let body = document.getElementById("body");
    ele.classList.toggle("sidebar-visible");
    body.classList.toggle("mobile-menu-active");
  }

  selectProduct(id: Number) {
    this.router.navigate(["/product", id]).then();
  }

  changeLocation(e) {
    this.data.location = e.target.value;
  }
}
