import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Unit } from '../models/unit';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UnitDialog} from '../unit-dialog/unit-dialog.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-unit-grid',
  templateUrl: './unit-grid.component.html',
  styleUrls: ['./unit-grid.component.scss']
})
export class UnitGridComponent implements OnInit {

  public units: Unit[] = [];
  public allUnits: Unit[] = [];
  public columns = 4;
  public sortBy: string = 'castle';
  public ascending: boolean = true;
  public castles: string[] = ['Castle', 'Conflux', 'Dungeon', 'Fortress', 'Inferno', 'Necropolis', 'Neutral', 'Rampart', 'Stronghold', 'Tower'];
  public castleFormControl = new FormControl();
  public search: string = '';

  constructor(private http: HttpClient, public dialog: MatDialog) {

    // Fill form control with all castles
    this.castleFormControl.setValue(this.castles);

    this.http.get('./assets/H3Units.csv', { responseType: 'text' as 'json'}).subscribe(data => {

      // Parse the text file and create units
      let lines = (data as string).split('\n');
      let first = true;

      lines.forEach(line => {
        if (first) {
          first = false;
          return;
        } else {
          // Unit_name,Castle,Level,Attack,Defence,Minimum Damage,Maximum Damage,Health,Speed,Growth,AI_Value,Gold,Additional_item,Special_abilities
          let info = line.split(',');

          let tempUnit = new Unit;
          tempUnit.unitName = info[0].replace(/([A-Z])/g, ' $1').trim();
          tempUnit.castle = info[1];
          tempUnit.level = info[2];
          tempUnit.attack = info[3];
          tempUnit.defence = info[4];
          tempUnit.minDamage = info[5];
          tempUnit.maxDamage = info[6];
          tempUnit.health = info[7];
          tempUnit.speed = info[8];
          tempUnit.growth = info[9];
          tempUnit.aiValue = info[10];
          tempUnit.gold = info[11];
          tempUnit.additionalItem = info[12];
          tempUnit.specialAbilities = info[13];

          this.units.push(tempUnit);
        }
      });

      // Remove last element.
      this.units.pop();

      // Make a copy of full list
      this.allUnits = this.units.slice();
    });
   }

  openDialog(unit: Unit): void {
    console.log('clicked');

    const dialogRef = this.dialog.open(UnitDialog, {
      width: '500px',
      data: unit
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit(): void {
    this.updateGridColumns(window.innerWidth);
  }

  onResize(event) {
    this.updateGridColumns(event.target.innerWidth);
  }

  updateGridColumns(width) {
    if (width <= 518) {
      this.columns = 1;
    } else if (width <= 768) {
      this.columns = 2;
    } else if (width <= 1015) {
      this.columns = 3;
    } else if (width <= 1270) {
      this.columns = 4;
    } else if (width <= 1525) {
      this.columns = 5;
    } else {
      this.columns = 6;
    }
  }

  sortByLevel(unit1: Unit, unit2: Unit) {
    let unit1Level = Number(unit1.level.replace('+', '')) * 2;
    let unit2Level = Number(unit2.level.replace('+', '')) * 2;

    if (unit1.level.includes('+')) {
      unit1Level += 1;
    }

    if (unit2.level.includes('+')) {
      unit2Level += 1;
    }

    if (unit1Level < unit2Level) {
      return this.ascending ? -1 : 1;
    } else {
      return this.ascending ? 1 : -1;
    }
  }

  sortByCastle(unit1: Unit, unit2: Unit) {
    let unit1Castle = unit1.castle;
    let unit2Castle = unit2.castle;

    if (unit1Castle < unit2Castle) {
      return this.ascending ? -1 : 1;
    } else if (unit1Castle > unit2Castle) {
      return this.ascending ? 1 : -1;
    } else {
      return this.sortByLevel(unit1, unit2);
    }
  }

  sortByProperty(unit1: Unit, unit2: Unit, property: string) {
    let unit1Value = unit1[property];
    let unit2Value = unit2[property];

    if (!isNaN(unit1Value)) {
      unit1Value = Number(unit1Value);
    }

    if (!isNaN(unit2Value)) {
      unit2Value = Number(unit2Value);
    }

    if (unit1Value < unit2Value) {
      return this.ascending ? -1 : 1;
    } else if (unit1Value > unit2Value) {
      return this.ascending ? 1 : -1;
    } else {
      return this.sortByLevel(unit1, unit2);
    }
  }

  sortUnitsWithSearch(searchString: string) {
    this.search = searchString;
    this.sortUnits();
  }

  sortUnits() {
    // Add all currently selected units.
    this.units = this.allUnits.filter((unit) => this.castleFormControl.value.includes(unit.castle) && unit.unitName.toLowerCase().includes(this.search))

    if (this.sortBy === "level") {
      this.units = this.units.sort((unit1, unit2) => {
        return this.sortByLevel(unit1, unit2);
      });
    } else {
      this.units = this.units.sort((unit1, unit2) => {
        return this.sortByProperty(unit1, unit2, this.sortBy);
      });
    }
  }

  resetWithoutSearch() {
    this.search = "";
    this.sortUnits();
  }
}
