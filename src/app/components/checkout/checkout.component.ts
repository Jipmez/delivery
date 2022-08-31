import { Component, OnInit } from "@angular/core";
import { CartService } from "../../services/cart.service";
import { CartModelServer } from "../../models/cart.model";
import { profile, apiResponse } from "../../models/profile.model";
import { Router } from "@angular/router";
import { OrderService } from "../../services/order.service";
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, NgForm, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { SessionStorageService } from "angular-web-storage";
declare var tidioChatApi;
declare var $;
import {
  Flutterwave,
  InlinePaymentOptions,
  PaymentSuccessResponse,
} from "flutterwave-angular-v3";
import { DataService } from "src/app/services/data.provider";

@Component({
  selector: "mg-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit {
  cartData: CartModelServer;
  cartTotal: any;
  showSpinner: Boolean;
  checkoutForm: any;
  user: any;
  loginForm: any;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private toast: ToastrService,
    public auth: AuthService,
    private session: SessionStorageService,
    private flutterwave: Flutterwave,
    public data: DataService
  ) {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  publicKey = "FLWPUBK_TEST-SANDBOXDEMOKEY-X";

  customerDetails: {
    name: any;
    email: any;
    phone_number: any;
  };

  customizations = {
    title: "Customization Title",
    description: "Customization Description",
    logo: "http://wp.alithemes.com/html/nest/demo/assets/imgs/theme/logo.svg",
  };

  meta = { counsumer_id: "7898", consumer_mac: "kjs9s8ss7dd" };

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.auth.profile().subscribe((res) => {
        this.user = res;
        console.log(this.user);
      });
    }

    this.checkoutForm = this.fb.group({
      full_name: ["", Validators.required],
      email: ["", [(Validators.required, Validators.email)]],
      phone: ["", Validators.required],
      address: this.fb.group({
        billing_address: [""],
        landmark: [""],
      }),
      delivery_time: ["2"],
    });

    setTimeout(() => {
      console.log(this.user);
      this.checkoutForm = this.fb.group({
        full_name: [this.user ? this.user?.full_name : "", Validators.required],
        email: [
          this.user ? this.user?.email : "",
          [(Validators.required, Validators.email)],
        ],
        phone: [this.user ? this.user?.phone : "", Validators.required],
        address: this.fb.group({
          billing_address: [
            this.user ? this.user.address?.billing_address : "",
          ],
          landmark: [this.user ? this.user.address?.landmark : ""],
        }),
        delivery_time: ["2"],
      });
    }, 1000);

    this.cartService.cartDataObs$.subscribe((data) => (this.cartData = data));
    this.cartService.cartTotal$.subscribe((total) => (this.cartTotal = total));
  }

  reloadCurrentPage() {
    this.auth.profile().subscribe(
      (res) => {
        this.user = res;
      },
      (e) => console.log(e)
    );

    setTimeout(() => {
      this.checkoutForm = this.fb.group({
        full_name: [
          this.user ? this.user.full_name : "",
          [Validators.required],
        ],
        email: [
          {
            value: this.user ? this.user.email : "",
            disabled: this.user ? true : false,
          },

          [Validators.required, Validators.email],
        ],
        phone: [this.user ? this.user.phone : "", [Validators.required]],
        address: this.fb.group({
          billing_address: [this.user ? this.user.address.billing_address : ""],
          landmark: [this.user ? this.user.address.landmark : ""],
        }),
        delivery_time: ["2"],
      });
    }, 1000);
  }

  onSubmit() {
    this.auth.login(this.loginForm.value).subscribe(
      (res) => {
        if (!res["token"]) return console.log("failed");
        let session = res["token"];
        this.session.set("sid", session);
        this.toast.success("logged in");
        return this.reloadCurrentPage();
      },
      (e) => {
        if (e) {
          return this.toast.error("unable to log in");
        }
      }
    );
  }

  makePayment(x: InlinePaymentOptions) {
    this.flutterwave.inlinePay(x);
  }
  makePaymentCallback(response: PaymentSuccessResponse): void {
    let payload = JSON.parse(localStorage.getItem("payload"));
    let payment = {
      status: response.status,
      amount: response.amount,
      tx_ref: response.tx_ref,
      flw_ref: response.flw_ref,
      tansaction_id: response.transaction_id,
    };
    payload.payment = payment;
    payload.cart.location = this.data.getUserLocation;
    delete payload.cart.total;
    /* return console.log(payload); */

    this.cartService.CheckoutCart(payload);
  }
  closedPaymentModal(): void {
    console.log("payment is closed");
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.checkoutForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  checkOut() {
    if (this.checkoutForm.invalid) {
      // here potentially add some visual feedback for a user
      return this.toast.success(
        this.findInvalidControls() + "" + "" + "is required"
      );
    }
    let payload = {
      user: this.checkoutForm.value,
      cart: JSON.parse(localStorage.getItem("cart")),
    };
    payload.cart.info = this.checkoutForm.value.info;
    payload.cart.total =
      this.checkoutForm.value.delivery_time == 1
        ? payload.cart.total + this.data.getUserLocationInstantPrice
        : payload.cart.total + this.data.getUserLocationLaterPrice;
    payload.cart.delivery_time = this.checkoutForm.value.delivery_time;
    delete payload.user.info;
    delete payload.user.delivery_time;
    localStorage.setItem("payload", JSON.stringify(payload));

    let paymentData = {
      public_key: this.publicKey,
      tx_ref: this.generateReference(),
      amount: payload.cart.total, //this.cartTotal,
      currency: "NGN",
      payment_options: "card,ussd",
      redirect_url: "",
      meta: this.meta,
      customer: {
        name: this.checkoutForm.value.full_name,
        email: this.checkoutForm.value.email,
        phone_number: this.checkoutForm.value.phone,
      },
      customizations: this.customizations,
      callback: this.makePaymentCallback,
      onclose: this.closedPaymentModal,
      callbackContext: this,
    };

    this.makePayment(paymentData);
    /*  console.log(payload); */
  }

  generateReference(): string {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 20; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  formatToCurrency(amount) {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }

  login() {
    let ele = document.getElementById("login_form");
    ele.classList.toggle("show");
  }

  collapsePass() {
    let ele = document.getElementById("collapsePassword");
    ele.classList.toggle("show");
  }
  tsd(x, email) {
    tidioChatApi.open();
    tidioChatApi.messageFromVisitor(x);

    tidioChatApi.setVisitorData({
      email: email,
    });

    /* $crisp.push(["do", "chat:open"]);
    $crisp.push(["set", "user:email", [email]]);
    $crisp.push(["do", "message:send", ["text", x]]); */
  }

  onCheckout(x: NgForm) {
    if (!x.value.email) {
      return this.toast.warning(
        "Billing Address: All fields are required",
        "",
        {
          timeOut: 2500,
          positionClass: "toast-top-right",
        }
      );

      /*  this.cartService.getcrtData() */
    }
    let radn = Math.floor(Math.random() * 100000) + 1;
    let mft = `Hi, i'm intreasted to purchase this product

    Product ID: ${radn}

    Total price: $${this.formatToCurrency(this.cartService.getcrtData().total)},

    How do i proceed to make payments ?
    `;

    this.tsd(mft, x.value.email);
    /*    this.spinner.show().then(p => {
      this.cartService.CheckoutFromCart(1);
    }); */
  }
}
