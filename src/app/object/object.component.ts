import {Component, OnInit} from '@angular/core';
import {SevenDaysObject} from './object.service';
import {DialogService} from '../dialog.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.scss']
})
export class ObjectComponent implements OnInit {

  public object: SevenDaysObject;

  constructor(private route: ActivatedRoute, public dialogService: DialogService) { }

  ngOnInit() {
    this.route.data.subscribe((data: { object: SevenDaysObject }) => {
      this.object = data.object;
    });
  }

}