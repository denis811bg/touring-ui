import { Injectable } from '@angular/core';
import { Observable, throwError } from "rxjs";

@Injectable({providedIn: 'root'})
export class ErrorService {

  constructor() {
  }

  public throwError(errorResponse: object): Observable<never> {
    console.log(errorResponse);
    return throwError(() =>
      new ErrorInfo(`${errorResponse}`.replace('Error: ', ''))
    );
  }
}

export class ErrorInfo {

  constructor(public message: string) {
  }
}
