import { Component, OnInit, ViewChild } from '@angular/core';
import { IncludedType } from "./const/included-type";
import { PlacesService } from "./services/places.service";
import { OpeningHours, Period, Place } from "./dto/place";
import { environment } from "../environments/environment";
import { MapInfoWindow, MapMarker } from "@angular/google-maps";
import { GoogleMapsService } from "./services/google-maps.service";
import _ from "lodash";
import { catchError, of } from "rxjs";
import * as mockedPlaces from '../assets/mockedPlaces.json';
import { Day } from "./const/day";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'touring-ui';

  @ViewChild(MapInfoWindow)
  public infoWindow!: MapInfoWindow;
  public gmSettings = environment.googleMap;
  public gmCenter: google.maps.LatLngLiteral = {
    lat: this.gmSettings.defaultLatitude,
    lng: this.gmSettings.defaultLongitude
  };
  public isGoogleMapsApiLoaded: boolean = false;

  public types: IncludedType[] = Object.values(IncludedType) as IncludedType[];
  public selectedTypes: Set<string> = new Set<string>();
  public filteredPlaces: Place[] = [];
  public radius: number = this.gmSettings.radius;

  public markers: IMarker[] = [];

  public days: string[] = Object.values(Day);
  public markerDetails!: IMarkerDetails;

  constructor(private readonly googleMapsService: GoogleMapsService,
              private readonly placesService: PlacesService) {
  }

  public ngOnInit(): void {
    this.googleMapsInitializer();
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

    this.placesService.getAllPlacesNearby(filterRequestData)
      .pipe(
        catchError(() => {
          return of(mockedPlaces as Place[]);
        })
      )
      .subscribe((places: Place[]) => {
        if (places && places.length > 0) {
          this.generateMarkers(places)
        }
      });
  }

  public generateMarkers(places: Place[]): void {
    _.forEach(places, (place: Place) => {
      this.markers.push({
        position: {
          lat: place.location.latitude,
          lng: place.location.longitude,
        },
        options: {},
        details: {
          title: place.displayName.text,
          rating: place.rating,
          ratingCount: place.userRatingCount,
          category: place.types[0],
          workingHours: !_.isEmpty(place.regularOpeningHours) ? place.regularOpeningHours : undefined
        }
      });
    });
  }

  public showInfoWindow(marker: MapMarker, details: IMarkerDetails): void {
    this.markerDetails = details;
    this.infoWindow.open(marker);
  }

  public normalizeCategory(category: string): string {
    return _.startCase(category.split("_").join(" "));
  }

  public normalizeWorkingHours(workingHours?: OpeningHours): string | undefined {
    const dayOfWeek = new Date().getDay();
    const customDayOfWeek: number = (dayOfWeek == 0 || dayOfWeek == 6) ? dayOfWeek : dayOfWeek - 1;

    if (workingHours) {
      if (workingHours.openNow) {
        return workingHours.weekdayDescriptions
          .filter((weekdayDescription: string) => weekdayDescription.split(": ")[0] == this.days[customDayOfWeek])
          .map((weekdayDescription: string) => "Working hours: " + weekdayDescription.split(": ")[1])
          [0];
      } else {
        const period: Period = workingHours.periods[customDayOfWeek];

        if (period) {
          const openHour = period.open.hour;
          const openMinute = period.open.minute.toString().padStart(2, '0');
          const dayPeriod = openHour < 12 ? "AM" : "PM";

          return `Open soon: ${openHour}:${openMinute} ${dayPeriod}`;
        }

        return undefined;
      }
    }

    return undefined;
  }


  private googleMapsInitializer(): void {
    if (this.googleMapsService.isGoogleMapsApiReady()) {
      if (this.gmSettings.isCurrentLocation) {
        navigator.geolocation.getCurrentPosition((currentPosition: GeolocationPosition) => {
          this.gmCenter = {
            lat: currentPosition.coords.latitude,
            lng: currentPosition.coords.longitude
          }
        });
      }

      this.isGoogleMapsApiLoaded = true;
    } else {
      setTimeout(() => this.googleMapsInitializer(), 1000);
    }
  }
}

export type FilterRequestData = {
  includedTypes: string[];
  latitude: number;
  longitude: number;
  radius: number;
}

interface IMarker {
  position: google.maps.LatLngLiteral;
  options: google.maps.MarkerOptions;
  details: IMarkerDetails;
}

interface IMarkerDetails {
  title: string;
  rating: number;
  ratingCount: number;
  category: string;
  workingHours?: OpeningHours;
}
