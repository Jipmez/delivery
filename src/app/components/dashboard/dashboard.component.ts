import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { ToastrService } from "ngx-toastr";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
@Component({
  selector: "mg-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  user: any;
  orders: any;
  hangepassForm: any;

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private toast: ToastrService
  ) {
    this.hangepassForm = this.fb.group({
      old_password: ["", Validators.required],
      password: ["", Validators.required],
      password2: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.auth.profile().subscribe((res) => {
        this.user = res;
        console.log(this.user);
      });

      this.auth.getUserOrder().subscribe((res) => {
        this.orders = res;
      });
    }
  }

  onSubmit() {
    this.auth.ChangePassword(this.hangepassForm.value).subscribe(
      (res) => {
        if (res) {
          this.hangepassForm.reset();
          this.toast.success(
            "Password Changed successfully",
            "Security Center",
            {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: "increasing",
              positionClass: "toast-top-right",
            }
          );
        }
      },
      (e) => {
        this.hangepassForm.reset();
        if (e.error["old_password"]) {
          return this.toast.warning(e.error["old_password"], "Security Center");
        } else {
          return this.toast.warning(e.error["password"][0], "Security Center");
        }
      }
    );
  }
}
