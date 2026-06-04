import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IEmployee } from "../../../../Model/EmployeeInterface";
import { IProject } from "../../../../Model/ProjectInterface";

@Component({
  selector: 'app-project-assignment-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-assignment-popup.component.html'
})
export class ProjectAssignmentPopupComponent implements OnChanges {
  @Input() employee: IEmployee | null = null;
  @Input() allProjects: IProject[] = [];
  @Input() assignedProjects: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<number[]>();

  selectedProjects: number[] = [];
  errorMessage = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assignedProjects']) {
      this.selectedProjects = this.assignedProjects?.map(p => p.ProjectId ?? p.projectId) ?? [];
      this.errorMessage = '';
    }
  }

  onProjectSelectChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const projectId = Number(select.value);
    if (!projectId) return;

    select.value = ''; // Reset select

    if (this.selectedProjects.includes(projectId)) {
      this.errorMessage = 'Project is already selected.';
      return;
    }

    if (this.selectedProjects.length >= 3) {
      this.errorMessage = 'You cannot assign more than 3 projects.';
      return;
    }

    this.errorMessage = '';
    this.selectedProjects.push(projectId);
  }

  removeProject(id: number): void {
    this.selectedProjects = this.selectedProjects.filter(pId => pId !== id);
    this.errorMessage = '';
  }

  getProjectName(id: number): string {
    const p = this.allProjects.find(item => item.ProjectId === id);
    return p ? p.ProjectName : 'Unknown Project';
  }

  onSave(): void {
    this.save.emit(this.selectedProjects);
  }

  onCancel(): void {
    this.close.emit();
  }
}
