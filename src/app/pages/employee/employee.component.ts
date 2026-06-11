import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { EmployeeService } from "../../services/employee.service";
import { DepartmentService } from "../../services/department.service";
import { ProjectService } from "../../services/project.service";
import { IEmployee } from "../../Model/EmployeeInterface";
import { IDepartment } from "../../Model/Departments";
import { IProject } from "../../Model/ProjectInterface";
import { ToastrService } from 'ngx-toastr';

import { CommonModule } from '@angular/common';
import { StatsBarComponent } from '../../components/stats-bar/stats-bar.component';
import { IStatsCard} from '../../Model/StatsCard'
import { FormPanelComponent } from './components/form-panel/form-panel.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ProjectAssignmentPopupComponent } from './components/project-assignment-popup/project-assignment-popup.component';
import { DetailsPopupComponent } from './components/details-popup/details-popup.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    NavBarComponent,CommonModule,StatsBarComponent,FormPanelComponent,DataTableComponent,ProjectAssignmentPopupComponent,DetailsPopupComponent
  ],
  templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly projectService = inject(ProjectService);
  private cd = inject(ChangeDetectorRef);
  private toastr = inject(ToastrService);

  employees: IEmployee[] = [];
  departments: IDepartment[] = [];
  allProjects: IProject[] = [];

  isEditMode = false;
  employeeToEdit: IEmployee | null = null;
  isSubmitting = false;

  showProjectPopup = false;
  projectEmp: IEmployee | null = null;
  assignedProjects: any[] = [];

  showDetailsPopup = false;
  detailsEmp: IEmployee | null = null;
  detailsProjects: any[] = [];

  get statsCards(): IStatsCard[] {
    return [
      { label: 'Total Employees', value: this.employees.length },
      { label: 'Active Employees', value: this.employees.filter(emp => emp.IsActive).length },
      { label: 'Inactive Employees', value: this.employees.filter(emp => !emp.IsActive).length },
      { label: 'Departments', value: this.departments.length }
    ];
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadDepartments();
    this.loadAllProjects();
  }

  loadEmployees(pageNo: number | null = null): void {
    this.employeeService.getAllEmployees(pageNo).subscribe({
      next: (data: any) => { this.employees = data; this.cd.detectChanges(); },
      error: (err) => console.error('Error loading employees:', err)
    });
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (data: any) => { this.departments = data; this.cd.detectChanges(); },
      error: (err) => console.error('Error loading departments:', err)
    });
  }

  loadAllProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data: any) => { this.allProjects = data; this.cd.detectChanges(); },
      error: (err) => console.error('Error loading projects:', err)
    });
  }

  onSaveEmployee(payload: IEmployee): void {
    this.isSubmitting = true;
    payload.DepartmentId = Number(payload.DepartmentId);
    payload.EmpAge = Number(payload.EmpAge);
    
    if (this.isEditMode && this.employeeToEdit) {
      payload.IsActive = this.employeeToEdit.IsActive;
      payload.EmpId = this.employeeToEdit.EmpId;
      payload.CreateBy = this.employeeToEdit.CreateBy || 'Admin';
      if (this.employeeToEdit.CreateDate) {
        payload.CreateDate = this.employeeToEdit.CreateDate;
      }
    } else {
      payload.IsActive = true;
      payload.CreateBy = payload.CreateBy || 'Admin';
    }

    const call = this.isEditMode 
      ? this.employeeService.updateEmployee(this.employeeToEdit!.EmpId, payload)
      : this.employeeService.createEmployee(payload);

    call.subscribe({
      next: () => {
        this.toastr.success(this.isEditMode ? 'Employee updated successfully' : 'Employee created successfully');
        this.isSubmitting = false;
        this.loadEmployees();
        this.onClearForm();
      },
      error: (err) => {
        console.error('Error saving employee:', err);
        this.toastr.error('Failed to save employee', err.error.Message);
        this.isSubmitting = false;
      }
    });
  }

  onEditEmployee(emp: IEmployee): void {
    this.isEditMode = true;
    this.employeeToEdit = emp;
  }

  onClearForm(): void {
    this.isEditMode = false;
    this.employeeToEdit = null;
  }

  onDeleteEmployee(empId: number): void {
    this.employeeService.deleteEmployee(empId).subscribe({
      next: () => {
        this.loadEmployees();
        this.toastr.success('Employee deleted successfully');
      },
      error: (err) => {
        console.error('Error deleting employee:', err);
        this.toastr.error('Failed to delete employee');
      }
    });
  }


  onOpenProjectPopup(emp: IEmployee): void {
    this.projectEmp = emp;
    this.employeeService.getAssignedProjects(emp.EmpId).subscribe({
      next: (data: any) => {
        this.assignedProjects = data || [];
        this.showProjectPopup = true;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error fetching assigned project:', err)
    });
  }

  onSaveProjectAssignments(selectedProjectIds: number[]): void {
    if (!this.projectEmp) return;
    this.isSubmitting = true;
    const empId = this.projectEmp.EmpId;

    const originalIds = this.assignedProjects.map(p => p.ProjectId ?? p.projectId);
    const toAssign = selectedProjectIds.filter(id => !originalIds.includes(id));
    const toRemove = originalIds.filter(id => !selectedProjectIds.includes(id));

    if (toAssign.length === 0 && toRemove.length === 0) {
      this.isSubmitting = false;
      this.onCloseProjectPopup();
      return;
    }

    let completed = 0;
    let hasError = false;
    const total = toAssign.length + toRemove.length;
    const finalize = (success: boolean) => {
      if (!success) hasError = true;
      completed++;
      if (completed === total) {
        this.isSubmitting = false;
        this.onCloseProjectPopup();
        this.loadEmployees();
        if (hasError) {
          this.toastr.warning('Some project assignments failed to update');
        } else {
          this.toastr.success('Project assignments updated successfully');
        }
      }
    };

    toAssign.forEach(id => this.employeeService.assignProject(empId, id, 'Admin').subscribe({ 
      next: () => finalize(true), 
      error: () => finalize(false) 
    }));
    toRemove.forEach(id => this.employeeService.removeFromProject(empId, id, 'Admin').subscribe({ 
      next: () => finalize(true), 
      error: () => finalize(false) 
    }));
  }

  onCloseProjectPopup(): void {
    this.showProjectPopup = false;
    this.projectEmp = null;
    this.assignedProjects = [];
  }

  onOpenDetailsPopup(emp: IEmployee): void {
    this.detailsEmp = emp;
    this.employeeService.getAssignedProjects(emp.EmpId).subscribe({
      next: (data: any) => {
        this.detailsProjects = data || [];
        this.showDetailsPopup = true;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error loading details projects:', err)
    });
  }

  onCloseDetailsPopup(): void {
    this.showDetailsPopup = false;
    this.detailsEmp = null;
    this.detailsProjects = [];
  }

  getDeptName(deptId: number): string {
    const dept = this.departments.find(d => d.DeptId === deptId);
    return dept ? dept.DeptName : 'Unknown Department';
  }
}
