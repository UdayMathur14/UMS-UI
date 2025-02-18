import { Optional } from "@angular/core";
import { Observable } from "rxjs";
import { BaseService } from "./base.service";
import { CommonUtility } from "../utilities/common";

export class CRUDService<T> {
    protected baseUrl = "";
    constructor(protected baseService: BaseService, @Optional() name: string = "master") {
        this.baseUrl = name;
    }

    get(path: string, params?: { [key: string]: any }): Observable<T[]> {
        let url: string = this.baseUrl + path;
        const query = CommonUtility.convertObjectToParams(params);
        if (query) {
            url += `?${query}`;
        }
        return this.baseService.get<T[]>(url);
    }

    getById(id: number): Observable<T> {
        return this.baseService.get<T>(`${this.baseUrl}${id}`);
    }

    add(path: string, data: any): Observable<T> {
        return this.baseService.post<T>(this.baseUrl + path, data);
    }

    update(path: string, id: Number, data: T): Observable<T> {
        let url: string = this.baseUrl + path;
        return this.baseService.put<T>(url, data);
    }

    remove(id: number): Observable<any> {
        return this.baseService.delete<any>(`${this.baseUrl}${id}`);
    }

    removeByParams(params?: { [key: string]: any }): Observable<T[]> {
        let url: string = this.baseUrl;
        const query = CommonUtility.convertObjectToParams(params);
        if (query) {
            url += `?${query}`;
        }
        return this.baseService.delete<any>(url);
    }
}