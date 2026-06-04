import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IEmployee } from "../../../../Model/EmployeeInterface";

@Component({
  selector: 'app-details-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-popup.component.html'
})
export class DetailsPopupComponent {
  @Input() employee: IEmployee | null = null;
  @Input() departmentName = '';
  @Input() projects: any[] = [];

  @Output() close = new EventEmitter<void>();
}
