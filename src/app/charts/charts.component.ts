import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Unit } from '../models/unit';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  options: any;
  theme: string;
  public units: Unit[] = [];
  public allUnits: Unit[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.theme = 'dark';

    // DONT COPY
    this.http
      .get('./assets/H3Units.csv', { responseType: 'text' as 'json' })
      .subscribe((data) => {
        // Parse the text file and create units
        let lines = (data as string).split('\n');
        let first = true;

        lines.forEach((line) => {
          if (first) {
            first = false;
            return;
          } else {
            // Unit_name,Castle,Level,Attack,Defence,Minimum Damage,Maximum Damage,Health,Speed,Growth,AI_Value,Gold,Additional_item,Special_abilities
            let info = line.split(',');

            let tempUnit = new Unit();
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

        // Create chart

        function getColor(castle: string) {
          switch(castle) {
            case 'castle':
              return 'lightskyblue';
            case 'conflux':
              return 'yellow';
            case 'dungeon':
              return 'lightpink';
            case 'fortress':
              return 'lightsalmon';
            case 'inferno':
              return 'lightgoldenrodyellow';
            case 'necropolis':
              return 'lightgreen';
            case 'neutral':
              return 'white';
            case 'stronghold':
              return 'orange';
            case 'rampart':
              return 'lightcoral';
            case 'tower':
              return 'lightsteelblue';
            default:
              return 'white';
          }
        }

        let factions = ['castle', 'conflux', 'dungeon', 'fortress', 'inferno', 'necropolis', 'neutral', 'stronghold', 'rampart', 'tower'];
        let data1 = factions.map(faction => this.units.filter(unit => unit.castle.toLowerCase() === faction).map(unit => [unit.attack, unit.defence]));
        let colors = factions.map(faction => getColor(faction));
        let dataSeries = data1.map(function(arr, index) {
          return {
            "name": factions[index],
            "type": 'scatter',
            "data": arr,
            "color": colors[index],
            "animationDelay": (idx) => {
              return idx * 10;
            }
          };
        });

        console.log(colors);
        console.log(data1);
        console.log(dataSeries);

        this.options = {
          title: {
            text: 'Attack vs Defence'
          },
          legend: {
            data: factions,
            align: 'left',
          },
          tooltip: {
            trigger: 'axis',
            formatter: (params) => {
              params = params[0];
              const date = new Date(params.name);
              return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
            },
            axisPointer: {
              animation: false
            }
          },
          xAxis: {},
          yAxis: {},
          series: dataSeries,
          animationEasing: 'elasticOut',
          animationDelayUpdate: function (idx) {
            return idx * 5;
          },
        };
      });
  }
}
