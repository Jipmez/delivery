import { Component, OnInit } from "@angular/core";
import { ProductService } from "../../services/product.service";

@Component({
  selector: "mg-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  constructor(private productService: ProductService) {}

  ngOnInit() {}

  changenav(x) {
    this.productService.changeMessage(x);
  }
}
