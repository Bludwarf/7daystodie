import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {WeaponsComponent} from './weapons/weapons.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatButtonToggleModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule, MatProgressBarModule, MatSelectModule,
  MatSidenavModule,
  MatTableModule,
  MatToolbarModule, MatTreeModule
} from '@angular/material';
import {MatSortModule} from '@angular/material/sort';
import {ForFilterPipe} from './pipes/for-filter.pipe';
import {TranslatePipe} from './pipes/translate.pipe';
import {ItemsService} from './items/items.service';
import {LocalizationService} from './localization/localization.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import { RoundPerMinutePipe } from './pipes/round-per-minute.pipe';
import {RecipesService} from './recipes/recipes.service';
import { RecipesComponent } from './recipes/recipes.component';
import {FormsModule} from '@angular/forms';
import { SummaryComponent } from './recipes/summary/summary.component';
import { RecipeNodeComponent } from './recipes/recipe-node/recipe-node.component';
import { ItemIconComponent } from './items/item-icon/item-icon.component';
import { RecipeComponent } from './recipe/recipe.component';
import { ItemComponent } from './item/item.component';
import { ObjectComponent } from './object/object.component';
import { DescribePipe } from './pipes/describe.pipe';
import { ItemModifierComponent } from './item-modifier/item-modifier.component';
import { UiAtlasItemIconComponent } from './ui-atlas-item-icon/ui-atlas-item-icon.component';
import {DescribeAttributePipe} from './pipes/describe-attribute.pipe';

@NgModule({
  declarations: [
    AppComponent,
    WeaponsComponent,
    TranslatePipe,
    ForFilterPipe,
    RoundPerMinutePipe,
    RecipesComponent,
    SummaryComponent,
    RecipeNodeComponent,
    ItemIconComponent,
    RecipeComponent,
    ItemComponent,
    ObjectComponent,
    DescribePipe,
    DescribeAttributePipe,
    ItemModifierComponent,
    UiAtlasItemIconComponent
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
    MatIconModule,
    FlexLayoutModule,
    CommonModule,
    MatSelectModule,
    MatTreeModule,
    MatProgressBarModule,
    FormsModule,
    MatButtonToggleModule
  ],
  providers: [
    ItemsService,
    LocalizationService,
    RecipesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
