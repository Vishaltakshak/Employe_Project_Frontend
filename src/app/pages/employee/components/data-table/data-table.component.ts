import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IEmployee } from "../../../../Model/EmployeeInterface";
import { IDepartment } from "../../../../Model/Departments";
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, PaginatorModule, FormsModule, ConfirmPopupModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './data-table.component.html',
})
export class DataTableComponent {
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  @Input() employees: IEmployee[] = [];
  @Input() departments: IDepartment[] = [];

  @Output() edit = new EventEmitter<IEmployee>();
  @Output() delete = new EventEmitter<number>();

  @Output() viewDetails = new EventEmitter<IEmployee>();
  @Output() assignProject = new EventEmitter<IEmployee>();
  @Output() fetchNextPage = new EventEmitter<number>();

  rows = 5;
  first = 0;

  private _searchTerm: string = "";

  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(val: string) {
    this._searchTerm = val;
    this.first = 0; 
  }

  get filteredEmployees(): IEmployee[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.employees;
    return this.employees.filter(emp => 
      emp.EmpName.toLowerCase().includes(term) ||
      emp.EmpEmail.toLowerCase().includes(term)
    );
  }

  get totalRecords(): number {
    return this.filteredEmployees.length;
  }

  // Kept for backward compatibility/button clicks
  searchEmployees(): IEmployee[] {
    return this.filteredEmployees;
  }

  getDeptName(deptId: number): string {
    const dept = this.departments.find(d => d.DeptId === deptId);
    return dept ? dept.DeptName : 'Unknown Department';
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    const pageNo = (event.first / event.rows) + 1;
    this.fetchNextPage.emit(pageNo);
  }

 onDeleteClick(event: Event, empId: number) {
  this.confirmationService.confirm({
  target: event.currentTarget as HTMLElement,
  message: 'Are you sure you want to delete this employee?',
  icon: 'pi pi-info-circle',

  acceptLabel: 'Delete', acceptButtonStyleClass: 'p-button-danger text-red-500',
  rejectLabel: 'Cancel',

  accept: () => {
    this.delete.emit(empId);
  },

  reject: () => {
    this.messageService.add({
      severity: 'warn',
      summary: 'Cancelled',
      detail: 'Delete operation cancelled'
    });
  }
});
}
}
