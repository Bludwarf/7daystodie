import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {WeaponsComponent} from './weapons/weapons.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule, MatInputModule, MatTableModule} from '@angular/material';
import {MatSortModule} from '@angular/material/sort';
import { TranslatePipe } from './pipes/translate.pipe';
import {ItemsService} from './services/config/items.service';
import {LocalizationService} from './services/config/localization.service';

@NgModule({
  declarations: [
    AppComponent,
    WeaponsComponent,
    TranslatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    ItemsService,
    LocalizationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
