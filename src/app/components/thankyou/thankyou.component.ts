import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { OrderService } from "../../services/order.service";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
@Component({
  selector: "mg-thankyou",
  templateUrl: "./thankyou.component.html",
  styleUrls: ["./thankyou.component.scss"],
})
export class ThankyouComponent implements OnInit {
  @ViewChild("invoice_wrapper", { static: true })
  el!: ElementRef<HTMLImageElement>;

  message: String;
  orderId: Number;
  products;
  cartTotal;
  constructor(private router: Router, private orderService: OrderService) {
    /*     const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      products: ProductResponseModel;
      total: Number;
    };
    this.products = state.products;
    this.cartTotal = state.total;
    console.log(state); */
  }

  ngOnInit() {}

  exportPDF() {
    html2canvas(this.el.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg");

      const pdf = new jsPDF({
        orientation: "portrait",
      });

      const imageProps = pdf.getImageProperties(imgData);

      const pdfw = pdf.internal.pageSize.getWidth();

      const pdfh = (imageProps.height * pdfw) / imageProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfw, pdfh);

      pdf.save("output.pdf");
    });
  }
}

interface ProductResponseModel {
  packaged: boolean;
  received: boolean;
  ordered_date: Date;
  ref_code: string;
  delivery_time: string;
  cart: Cart[];
  billing_address: BillingAddress;
  payment: Payment;
}
interface BillingAddress {
  landmark: string;
  billing_address: string;
}
interface Cart {
  item: string;
  info: string;
  quantity: number;
}

interface Payment {
  amount: number;
  status: string;
}
