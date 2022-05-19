import { Type } from "@angular/core";
import { Observable } from "rxjs";

export abstract class ProxyAPIServiceDef {
    abstract getData<T>() : Observable<T>;
}