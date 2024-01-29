import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable } from "rxjs";
import { ErrorService } from "./error.service";

@Injectable({providedIn: 'root'})
export class InternalHttpClient {

  constructor(private readonly httpClient: HttpClient,
              private readonly errorService: ErrorService) {
  }

  public postRequest<D>(apiUrl: string, data: D): Observable<any> {
    return this.httpClient.post(apiUrl, data, {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).pipe(
      catchError(errorResponse => this.errorService.throwError(errorResponse))
    );
  }
}
