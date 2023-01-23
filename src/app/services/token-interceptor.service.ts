import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpXsrfTokenExtractor } from "@angular/common/http";
import { SessionStorageService } from "angular-web-storage";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(
    public session: SessionStorageService,
    private server: AuthService,
    private tokenExtractor: HttpXsrfTokenExtractor
  ) {}

  intercept(req, next) {
    const cookieheaderName = "X-CSRFToken";
    let csrfToken = this.tokenExtractor.getToken() as string;
    if (csrfToken !== null && !req.headers.has(cookieheaderName)) {
      req = req.clone({
        headers: req.headers.set(cookieheaderName, csrfToken),
      });
    }
    console.log(req);
    let token = this.server.getToken();
    if (token) {
      let tokenixed = req.clone({
        setHeaders: {
          Authorization: `token ${token}`,
        },
      });

      return next.handle(tokenixed);
    } else {
      let tokenixed = req.clone({
        setHeaders: {},
      });

      return next.handle(tokenixed);
    }
  }
}
