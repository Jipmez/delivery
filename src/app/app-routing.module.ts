import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { CartComponent } from "./components/cart/cart.component";
import { CheckoutComponent } from "./components/checkout/checkout.component";
import { ShopComponent } from "./components/shop/shop.component";
import { ProductComponent } from "./components/product/product.component";
import { ThankyouComponent } from "./components/thankyou/thankyou.component";
import { AuthComponent } from "./components/auth/auth.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DispatchComponent } from "./components/dispatch/dispatch.component";
const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "product/:id",
    component: ProductComponent,
  },
  {
    path: "shop/:id/:name",
    component: ShopComponent,
  },
  {
    path: "cart",
    component: CartComponent,
  },
  {
    path: "checkout",
    component: CheckoutComponent,
  },
  {
    path: "thankyou",
    component: ThankyouComponent,
  },
  {
    path: "user-account",
    component: DashboardComponent,
  },
  {
    path: "dispatch-account",
    component: DispatchComponent,
  },
  {
    path: "authenticate",
    component: AuthComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
