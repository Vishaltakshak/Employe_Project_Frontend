import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IDepartment } from "../../../../Model/Departments";
import { IEmployee } from "../../../../Model/EmployeeInterface";
import { noWhitespaceValidator } from '../../../../utilities/whiteSpaceValidator';

@Component({
  selector: 'app-form-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-panel.component.html'
})
export class FormPanelComponent implements OnChanges {
  @Input() departments: IDepartment[] = [];
  @Input() isEditMode = false;
  @Input() employeeToEdit: IEmployee | null = null;
  @Input() isSubmitting = false;

  @Output() save = new EventEmitter<any>();
  @Output() clear = new EventEmitter<void>();

  today = new Date().toISOString().split('T')[0];  updateForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      EmpId: [0],
      EmpName: ['', [Validators.required, Validators.minLength(2), noWhitespaceValidator]],
      EmpEmail: ['', [Validators.required, Validators.email]],
      EmpAge: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      DateOfJoining: ['', Validators.required],
      DepartmentId: ['', Validators.required],
      CreateBy: ['Admin'],
      CreateDate: [null],
      ModifiedBy: ['Admin'],
      ModifiedDate: [null]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employeeToEdit']) {
      if (this.employeeToEdit && this.isEditMode) {
        let formattedDate = '';
        if (this.employeeToEdit.DateOfJoining) {
          formattedDate = this.employeeToEdit.DateOfJoining.substring(0, 10);
        }
        this.updateForm.patchValue({
          EmpId: this.employeeToEdit.EmpId,
          EmpName: this.employeeToEdit.EmpName,
          EmpEmail: this.employeeToEdit.EmpEmail,
          EmpAge: this.employeeToEdit.EmpAge,
          DateOfJoining: formattedDate,
          DepartmentId: this.employeeToEdit.DepartmentId,
          CreateBy: this.employeeToEdit.CreateBy || 'Admin',
          CreateDate: this.employeeToEdit.CreateDate,
          ModifiedBy: this.employeeToEdit.ModifiedBy || 'Admin',
          ModifiedDate: new Date().toISOString()
        });
      } else {
        this.onClear();
      }
    }
  }

  onSubmit(): void {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }
    this.save.emit(this.updateForm.value);
  }

  onClear(): void {
    this.updateForm.reset({
      EmpId: 0,
      EmpName: '',
      EmpEmail: '',
      EmpAge: '',
      DateOfJoining: new Date().toISOString().substring(0, 10),
      DepartmentId: '',
      CreateBy: 'Admin',
      CreateDate: new Date().toISOString(),
      ModifiedBy: 'Admin',
      ModifiedDate: null
    });
    this.clear.emit();
  }
}
