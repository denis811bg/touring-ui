import { Injectable } from '@angular/core';
import { InternalHttpClient } from "../core/internal-http-client";
import { FilterRequestData } from "../app.component";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Place } from "../dto/place";

@Injectable({providedIn: 'root'})
export class PlacesService {
  private static BASE_PLACES_API_URL: string = "/api/places";
  private static GET_PLACES_NEARBY_API_URL: string = PlacesService.BASE_PLACES_API_URL.concat("/places-nearby");

  constructor(private readonly internalHttpClient: InternalHttpClient) {
  }

  public getAllPlacesNearby(data: FilterRequestData): Observable<Place[]> {
    return this.internalHttpClient.postRequest(
      environment.internalApiUrl.concat(PlacesService.GET_PLACES_NEARBY_API_URL),
      data);
  }
}
