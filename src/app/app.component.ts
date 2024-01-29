import { Component, OnInit } from '@angular/core';
import { IncludedType } from "./const/included-type";
import { PlacesService } from "./services/places.service";
import { Place } from "./dto/place";
import { environment } from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'touring-ui';

  public gmSettings = environment.googleMap;
  public gmCenter: google.maps.LatLngLiteral = {
    lat: this.gmSettings.defaultLatitude,
    lng: this.gmSettings.defaultLongitude
  };

  public types: IncludedType[] = Object.values(IncludedType) as IncludedType[];
  public selectedTypes: Set<string> = new Set<string>();
  public filteredPlaces: Place[] = [];
  public radius: number = this.gmSettings.radius;

  constructor(private readonly placesService: PlacesService) {
  }

  public ngOnInit(): void {
    this.googleMapInitializer();
  }

  public toggleType(type: IncludedType): void {
    if (this.selectedTypes.has(type.valueOf())) {
      this.selectedTypes.delete(type.valueOf());
    } else {
      this.selectedTypes.add(type.valueOf());
    }
  }

  public isSelected(type: IncludedType): boolean {
    return this.selectedTypes.has(type.valueOf());
  }

  public filter(): void {
    const filterRequestData: FilterRequestData = {
      includedTypes: Array.from(this.selectedTypes),
      latitude: this.gmCenter.lat,
      longitude: this.gmCenter.lng,
      radius: this.radius
    };

    this.placesService.getAllPlacesNearby(filterRequestData).subscribe((places: Place[]) => {
      if (places && places.length > 0) {
        console.log(places);
        // TODO: generate and display Google Map Markers
      }
    });
  }

  private googleMapInitializer(): void {
    if (this.gmSettings.isCurrentLocation) {
      navigator.geolocation.getCurrentPosition((currentPosition: GeolocationPosition) => {
        this.gmCenter = {
          lat: currentPosition.coords.latitude,
          lng: currentPosition.coords.longitude
        }
      });
    }
  }
}

export type FilterRequestData = {
  includedTypes: string[];
  latitude: number;
  longitude: number;
  radius: number;
}
