import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class GoogleMapsService {

  private isApiReady: boolean = false;

  constructor() {
    this.loadGoogleMapsAPIScript();
  }

  public isGoogleMapsApiReady(): boolean {
    return this.isApiReady;
  }

  private loadGoogleMapsAPIScript(): void {
    (<any>window).googleMapsAPIReady = this.googleMapsAPIReady.bind(this);
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD6iJTWSWJmLT9Pm3PG53DFKUEzXqmerok&v=3&callback=googleMapsAPIReady";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  private googleMapsAPIReady(): void {
    this.isApiReady = true;
  }
}
