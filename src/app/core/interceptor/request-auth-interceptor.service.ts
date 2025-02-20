import { Injectable } from "@angular/core";
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
    providedIn: "root",
})
export class AuthInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const tokenData = window.localStorage.getItem('data');
        if(tokenData){
            req = req.clone({ headers: req.headers.set("Authorization", `Bearer ${JSON.parse(tokenData).accessToken}`) });
        }
        
        return next.handle(req);
    }
}
