import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientXsrfModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HomeComponent } from "./components/home/home.component";

import { CartComponent } from "./components/cart/cart.component";
import { CheckoutComponent } from "./components/checkout/checkout.component";
import { HttpClientModule } from "@angular/common/http";
import { ProductComponent } from "./components/product/product.component";
import { ThankyouComponent } from "./components/thankyou/thankyou.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { FlutterwaveModule } from "flutterwave-angular-v3";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";
import { AuthComponent } from "./components/auth/auth.component";
import { TokenInterceptorService } from "./services/token-interceptor.service";
import { VendorComponent } from "./components/vendor/vendor.component";
import { ShopComponent } from "./components/shop/shop.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DispatchComponent } from "./components/dispatch/dispatch.component";
import { ShopsComponent } from "./components/shops/shops.component";
import { CategoriesComponent } from './components/categories/categories.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CartComponent,
    CheckoutComponent,
    ProductComponent,
    ThankyouComponent,
    AuthComponent,
    VendorComponent,
    ShopComponent,
    DashboardComponent,
    DispatchComponent,
    ShopsComponent,
    CategoriesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    HttpClientXsrfModule.withOptions({
      cookieName: "csrftoken",
      headerName: "X-CSRFToken",
    }),
    FormsModule,
    FlutterwaveModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    { provide: Window, useValue: window },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
