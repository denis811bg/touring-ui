import { Component, Input } from '@angular/core';
import { IMarkerDetails } from "../../app.component";

@Component({
  selector: 'app-marker-info-window',
  templateUrl: './marker-info-window.component.html',
  styleUrls: ['./marker-info-window.component.css']
})
export class MarkerInfoWindowComponent {
  @Input()
  public markerDetails: IMarkerDetails | undefined;
}
