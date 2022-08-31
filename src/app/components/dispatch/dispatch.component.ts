import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
@Component({
  selector: "mg-dispatch",
  templateUrl: "./dispatch.component.html",
  styleUrls: ["./dispatch.component.scss"],
})
export class DispatchComponent implements OnInit {
  constructor(public auth: AuthService) {}
  user: any;
  orders: any;
  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.auth.profile().subscribe((res) => {
        console.log(res);
        this.user = res;
      });

      this.auth.getDispatchDelivery().subscribe((res) => {
        console.log(res);
        this.orders = res;
      });
    }
  }

  refresh() {
    this.orders = [];
    this.auth.getDispatchDelivery().subscribe((res) => {
      this.orders = res;
    });
  }

  confirm(x: NgForm) {
    this.auth
      .ConfirmDispatchDelivery({ update_code: x.value.deliveryid })
      .subscribe((res) => {
        console.log(res["message"]);
      });
    x.reset();
  }
}
