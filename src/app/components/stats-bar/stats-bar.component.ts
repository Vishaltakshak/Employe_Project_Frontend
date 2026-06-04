import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IStatsCard } from '../../Model/StatsCard';  

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-bar.component.html',
  styleUrls: []
})
export class StatsBarComponent {
  @Input() statsCards: IStatsCard[] = [];
}
