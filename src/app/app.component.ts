import { ApplicationRef, Component, ComponentFactoryResolver, EmbeddedViewRef, Injector, OnInit } from '@angular/core';
import { IncludedType } from "./const/included-type";
import { PlacesService } from "./services/places.service";
import { OpeningHours, Period, Place } from "./dto/place";
import { environment } from "../environments/environment";
import { GoogleMapsService } from "./services/google-maps.service";
import _ from "lodash";
import { catchError, of } from "rxjs";
import * as mockedPlaces from '../assets/mockedPlaces.json';
import { Day } from "./const/day";
import { MarkerInfoWindowComponent } from "./components/marker-info-window/marker-info-window.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public gmSettings = environment.googleMap;
  public gmCenter: google.maps.LatLngLiteral = {
    lat: this.gmSettings.defaultLatitude,
    lng: this.gmSettings.defaultLongitude
  };
  public types: IncludedType[] = Object.values(IncludedType) as IncludedType[];
  public radius: number = this.gmSettings.radius;

  private map: google.maps.Map | undefined;
  private gmOptions: google.maps.MapOptions = {
    center: this.gmCenter,
    zoom: this.gmSettings.zoom,
    minZoom: this.gmSettings.minZoom,
    maxZoom: this.gmSettings.maxZoom
  }
  private isGoogleMapsApiLoaded: boolean = false;
  private selectedTypes: Set<string> = new Set<string>();
  private days: string[] = Object.values(Day);
  private currentInfoWindow: google.maps.InfoWindow | null = null;

  constructor(private readonly googleMapsService: GoogleMapsService,
              private readonly placesService: PlacesService,
              private readonly resolver: ComponentFactoryResolver,
              private readonly appRef: ApplicationRef,
              private readonly injector: Injector) {
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
          this.generateAndShowMarkers(places)
        }
      });
  }

  private googleMapsInitializer(): void {
    if (this.googleMapsService.isGoogleMapsApiReady()) {
      const initializeMap = () => {
        const mapContainer: HTMLElement | null = document.getElementById("mapContainer");
        if (!_.isNil(mapContainer)) {
          this.map = new google.maps.Map(mapContainer, this.gmOptions);
        }
      }

      if (this.gmSettings.isCurrentLocation) {
        navigator.geolocation.getCurrentPosition((currentPosition: GeolocationPosition) => {
          this.gmCenter = {
            lat: currentPosition.coords.latitude,
            lng: currentPosition.coords.longitude
          }

          this.gmOptions.center = this.gmCenter;
          initializeMap();
        });
      }

      this.isGoogleMapsApiLoaded = true;
      initializeMap();
    } else {
      setTimeout(() => this.googleMapsInitializer(), 1000);
    }
  }

  private generateAndShowMarkers(places: Place[]): void {
    _.forEach(places, (place: Place) => {
      const iMarker = this.generateIMarker(place);
      const marker = this.displayMarker(iMarker);
      const infoWindow: google.maps.InfoWindow = this.displayMarkerInfoWindow(iMarker.details);
      marker.addListener("click", () => {
        if (this.currentInfoWindow) {
          this.currentInfoWindow.close();
        }

        infoWindow.open({
          anchor: marker,
          map: this.map
        });

        this.currentInfoWindow = infoWindow;
      });
    });
  }

  private generateIMarker(place: Place): IMarker {
    return {
      position: {
        lat: place.location.latitude,
        lng: place.location.longitude,
      },
      options: {},
      details: {
        title: place.displayName.text,
        rating: place.rating,
        ratingCount: place.userRatingCount,
        category: this.normalizeCategory(place.types[0]),
        workingHours: this.normalizeWorkingHours(place.regularOpeningHours)
      }
    }
  }

  private normalizeCategory(category: string): string {
    return _.startCase(category.split("_").join(" "));
  }

  private normalizeWorkingHours(workingHours?: OpeningHours): string | undefined {
    const dayOfWeek = new Date().getDay();
    const customDayOfWeek: number = (dayOfWeek == 0 || dayOfWeek == 6) ? dayOfWeek : dayOfWeek - 1;

    if (!_.isNil(workingHours)) {
      if (workingHours.openNow) {
        return workingHours.weekdayDescriptions
          .filter((weekdayDescription: string) => weekdayDescription.split(": ")[0] == this.days[customDayOfWeek])
          .map((weekdayDescription: string) => "Working hours: " + weekdayDescription.split(": ")[1])
          [0];
      } else {
        const period: Period = workingHours.periods[customDayOfWeek];

        if (!_.isNil(period)) {
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

  private displayMarker(marker: IMarker): google.maps.Marker {
    return new google.maps.Marker({
      position: marker.position,
      map: this.map
    });
  }

  private displayMarkerInfoWindow(markerDetails: IMarkerDetails): google.maps.InfoWindow {
    const infoWindowRef = this.resolver.resolveComponentFactory(MarkerInfoWindowComponent).create(this.injector);
    infoWindowRef.instance.markerDetails = markerDetails;

    this.appRef.attachView(infoWindowRef.hostView);

    const domElem = (infoWindowRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    return new google.maps.InfoWindow({
      content: domElem,
      ariaLabel: markerDetails.title
    });
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

export interface IMarkerDetails {
  title: string;
  rating: number;
  ratingCount: number;
  category: string;
  workingHours?: string;
}
