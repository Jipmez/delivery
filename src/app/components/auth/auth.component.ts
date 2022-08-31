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
@Component({
  selector: "mg-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit {
  rout: any;
  loginForm: any;
  constructor(
    private ac: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private session: SessionStorageService
  ) {
    this.ac.queryParams.subscribe((res) => {
      this.rout = res.auth;
    });
    this.loginForm = this.fb.group({
      username: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  onSubmit() {
    this.auth.login(this.loginForm.value).subscribe(
      (res) => {
        if (!res["token"]) return console.log("failed");
        let session = res["token"];
        this.session.set("sid", session);
        if (res["role"] == null) {
          this.router.navigate(["user-account"]);
        }
        if (res["role"] == "Dispatch") {
          this.router.navigate(["dispatch-account"]);
        }
      },
      (e) => {
        if (e) {
          console.log("unable to login");
        }
      }
    );
  }

  ngOnInit(): void {}
}
