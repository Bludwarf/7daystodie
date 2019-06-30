import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ObjectService, SevenDaysObject} from '../object/object.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {DEFAULT_LANG, ENGLISH_LANG, LocalizationService} from '../localization/localization.service';
import {Router} from '@angular/router';
import {MatOptionSelectionChange} from '@angular/material';
import {ObjectsCache} from '../common/xml-object';

const FILTERED_OBJECTS_MAX_SIZE = 0;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  query = new FormControl('');
  objects: SevenDaysObject[];
  filteredObjects: Observable<SevenDaysObject[]>;
  private filterObjectsCache = new ObjectsCache<SevenDaysObject[]>();

  constructor(private objectService: ObjectService, private localization: LocalizationService, private router: Router) {
    this.objects = this.objectService.getAll();
    this.filteredObjects = this.query.valueChanges
      .pipe(
        startWith(''),
        map(value => value && value.length >= 3 ? this._filterObjects(value) : [])
      );
    this.filteredObjects.subscribe(filteredObjects => {
      if (filteredObjects && filteredObjects.length === 1) {
        const object = filteredObjects[0];
        return this.router.navigate([`/${object.name}`]);
      }
    });
  }

  ngOnInit() {
  }

  private _filterObjects(value: string): SevenDaysObject[] {
    return this.filterObjectsCache.getOrPut(value, () => {
      const filterValue = value.toLowerCase();

      const matches = (stringValue: string) => stringValue.toLowerCase().indexOf(filterValue) !== -1;
      let count = 0;
      return this.objects.filter(object => {
        // Limit size
        if (FILTERED_OBJECTS_MAX_SIZE && count >= FILTERED_OBJECTS_MAX_SIZE) {
          console.log('Search filtered elements truncated to ' + FILTERED_OBJECTS_MAX_SIZE);
          return false;
        }
        // check internal name
        const matched = DEFAULT_LANG !== ENGLISH_LANG && matches(this.localization.translate(object.name)) ||
          matches(this.localization.translate(object.name, ENGLISH_LANG)) ||
          matches(object.name) ||
          DEFAULT_LANG !== ENGLISH_LANG && matches(this.localization.describe(object)) ||
          matches(this.localization.describe(object, ENGLISH_LANG));
        if (matched) {
          ++count;
        }
        return matched;
      });
    });
  }

  selectObject(object: SevenDaysObject, $event?: MatOptionSelectionChange): Promise<boolean> {
    if (!$event || $event.source.selected) {
      return this.router.navigate([`/${object.name}`]);
    } else {
      return Promise.resolve(false);
    }
  }
}
