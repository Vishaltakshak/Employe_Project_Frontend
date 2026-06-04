import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IEmployee } from "../../../../Model/EmployeeInterface";
import { IDepartment } from "../../../../Model/Departments";

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html'
})
export class DataTableComponent {
  @Input() employees: IEmployee[] = [];
  @Input() departments: IDepartment[] = [];

  @Output() edit = new EventEmitter<IEmployee>();
  @Output() delete = new EventEmitter<number>();

  @Output() viewDetails = new EventEmitter<IEmployee>();
  @Output() assignProject = new EventEmitter<IEmployee>();

  getDeptName(deptId: number): string {
    const dept = this.departments.find(d => d.DeptId === deptId);
    return dept ? dept.DeptName : 'Unknown Department';
  }
}
