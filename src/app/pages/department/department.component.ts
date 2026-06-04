import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { DepartmentService } from "../../services/department.service";
import { IDepartment } from "../../Model/Departments";

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatsBarComponent } from '../../components/stats-bar/stats-bar.component';
import { IStatsCard} from '../../Model/StatsCard'

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [NavBarComponent, CommonModule, ReactiveFormsModule, StatsBarComponent],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentComponent implements OnInit {
  private readonly departmentService = inject(DepartmentService);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  
  departments: IDepartment[] = [];
  updateForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor() {
    this.updateForm = this.fb.group({
      DeptId: [0],
      DeptName: ['', [Validators.required, Validators.minLength(2)]],
      Description: [''],
      IsActive: [true],
      CreateBy: ['Admin'],
      CreateDate: [null],
      ModifiedBy: ['Admin'],
      ModifiedDate: [null]
    });
  }

  get statsCards(): IStatsCard[] {
    return [
      { label: 'Total Departments', value: this.departments.length },
      { label: 'Active', value: this.activeCount },
      { label: 'Inactive', value: this.inactiveCount }
    ];
  }

  get activeCount(): number {
    return this.departments.filter(dept => dept.IsActive).length;
  }

  get inactiveCount(): number {
    return this.departments.filter(dept => !dept.IsActive).length;
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (data: any) => {
        this.departments = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading departments:', err);
      }
    });
  }

  onAdd(): void {
    this.isEditMode = false;

    this.updateForm.reset({
      DeptId: 0,
      DeptName: '',
      Description: '',
      IsActive: true,
      CreateBy: 'Admin',
      CreateDate: new Date().toISOString(),
      ModifiedBy: 'Admin',
      ModifiedDate: null
    });
  }

  onEdit(dept: IDepartment): void {
    this.isEditMode = true;
    this.updateForm.patchValue({
      DeptId: dept.DeptId,
      DeptName: dept.DeptName,
      Description: dept.Description,
      IsActive: dept.IsActive,
      CreateBy: dept.CreateBy || 'Admin',
      CreateDate: dept.CreateDate,
      ModifiedBy: dept.ModifiedBy || 'Admin',
      ModifiedDate: new Date().toISOString()
    });
  }

  closeForm(): void {
    this.isEditMode = false;
    this.updateForm.reset({
      DeptId: 0,
      DeptName: '',
      Description: '',
      IsActive: true,
      CreateBy: 'Admin',
      CreateDate: new Date().toISOString(),
      ModifiedBy: 'Admin',
      ModifiedDate: null
    });
  }

  onSubmit(): void {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.updateForm.value as IDepartment;

    if (this.isEditMode) {
      this.departmentService.updateDepartment(formData.DeptId, formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.loadDepartments();
          this.closeForm();
          
        },
        error: (err) => {
          console.error('Error updating department:', err);
          this.isSubmitting = false;
        }
      });
    } else {
      this.departmentService.createDepartment(formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.loadDepartments();
          this.closeForm();
          
        },
        error: (err) => {
          console.error('Error creating department:', err);
          this.isSubmitting = false;
          
        }
      });
    }
  }

  onDelete(deptId: number): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.deleteDepartment(deptId).subscribe({
        next: () => {
          this.loadDepartments();
          
        },
        error: (err) => {
          console.error('Error deleting department:', err);
          
        }
      });
    }
  }
}
