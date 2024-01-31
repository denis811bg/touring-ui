import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { HttpClientModule } from "@angular/common/http";
import { GoogleMap, GoogleMapsModule } from "@angular/google-maps";
import { MarkerInfoWindowComponent } from './components/marker-info-window/marker-info-window.component';

@NgModule({
  declarations: [
    AppComponent,
    MarkerInfoWindowComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    HttpClientModule,
    GoogleMapsModule
  ],
  providers: [
    GoogleMap
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
