import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { SessionStorageService } from "angular-web-storage";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "mg-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit {
  rout: any;
  loginForm: any;
  signupForm: any;
  constructor(
    private ac: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastrService,
    private session: SessionStorageService
  ) {
    this.ac.queryParams.subscribe((res) => {
      this.rout = res.auth;
    });
    this.loginForm = this.fb.group({
      username: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });

    this.signupForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }
  // #f5a623
  onSubmit() {
    this.auth.login(this.loginForm.value).subscribe(
      (res) => {
        if (!res["token"]) return console.log("failed");
        let session = res["token"];
        this.session.set("sid", session);
        if (res["role"] == null) {
          this.toast.success("Login successful", "Authentication");
          this.router.navigate(["user-account"]);
        }
        if (res["role"] == "Dispatch") {
          this.toast.success("Login successful", "Authentication");
          this.router.navigate(["dispatch-account"]);
        }

        this.loginForm.reset();
      },
      (e) => {
        if (e) {
          this.loginForm.reset();
          this.toast.error("Unable to login", "Authentication");
        }
      }
    );
  }

  signUp() {
    this.auth.signup(this.signupForm.value).subscribe(
      (res) => {
        this.signupForm.reset();
        if (!res["token"]) return console.log("failed");
        let session = res["token"];
        this.toast.success("Successful", "Authentication");
        this.router.navigate(["user-account"]);
      },
      (e) => {
        this.signupForm.reset();
        this.toast.error("Unable to register", "Authentication");
      }
    );
  }

  ngOnInit(): void {}
}
