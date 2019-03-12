import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {WeaponsComponent} from './weapons/weapons.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSidenavModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {MatSortModule} from '@angular/material/sort';
import {ForFilterPipe} from './pipes/for-filter.pipe';
import {TranslatePipe} from './pipes/translate.pipe';
import {ItemsService} from './services/config/items.service';
import {LocalizationService} from './services/config/localization.service';

@NgModule({
  declarations: [
    AppComponent,
    WeaponsComponent,
    TranslatePipe,
    ForFilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    ItemsService,
    LocalizationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
