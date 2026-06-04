import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ProjectService } from "../../services/project.service";
import { IProject } from "../../Model/ProjectInterface";

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatsBarComponent, IStatsCard } from '../../components/stats-bar/stats-bar.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NavBarComponent, CommonModule, ReactiveFormsModule, StatsBarComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  
  projects: IProject[] = [];
  updateForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
 

  constructor() {
    this.updateForm = this.fb.group({
      ProjectId: [0],
      ProjectName: ['', [Validators.required, Validators.minLength(2)]],
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
      { label: 'Total Projects', value: this.projects.length },
      { label: 'Active', value: this.activeCount },
      { label: 'Inactive', value: this.inactiveCount }
    ];
  }

  get activeCount(): number {
    return this.projects.filter(proj => proj.IsActive).length;
  }

  get inactiveCount(): number {
    return this.projects.filter(proj => !proj.IsActive).length;
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data: any) => {
        this.projects = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading projects:', err);
      
      }
    });
  }

  onAdd(): void {
    this.isEditMode = false;
   
    this.updateForm.reset({
      ProjectId: 0,
      ProjectName: '',
      Description: '',
      IsActive: true,
      CreateBy: 'Admin',
      CreateDate: new Date().toISOString(),
      ModifiedBy: 'Admin',
      ModifiedDate: null
    });
  }

  onEdit(proj: IProject): void {
    this.isEditMode = true;
    

    this.updateForm.patchValue({
      ProjectId: proj.ProjectId,
      ProjectName: proj.ProjectName,
      Description: proj.Description,
      IsActive: proj.IsActive,
      CreateBy: proj.CreateBy || 'Admin',
      CreateDate: proj.CreateDate,
      ModifiedBy: proj.ModifiedBy || 'Admin',
      ModifiedDate: new Date().toISOString()
    });
  }

  closeForm(): void {
    this.isEditMode = false;
    this.updateForm.reset({
      ProjectId: 0,
      ProjectName: '',
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
    
    
    const formData = this.updateForm.value as IProject;

    if (this.isEditMode) {
      this.projectService.updateProject(formData.ProjectId, formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.loadProjects();
          this.closeForm();
        },
        error: (err) => {
          console.error('Error updating project:', err);
          this.isSubmitting = false;
        }
      });
    } else {
      this.projectService.createProject(formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.loadProjects();
          this.closeForm();
        },
        error: (err) => {
          console.error('Error creating project:', err);
          this.isSubmitting = false;
        }
      });
    }
  }

  onDelete(projId: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(projId).subscribe({
        next: () => {
          this.loadProjects();
        },
        error: (err) => {
          console.error('Error deleting project:', err);
        }
      });
    }
  }

  

  
}
