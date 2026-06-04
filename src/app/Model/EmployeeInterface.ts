export interface IEmployee {
  EmpId: number;
  EmpName: string;
  EmpEmail: string;
  EmpAge: number;
  DateOfJoining: string;
  DepartmentId: number;
  IsActive: boolean;
  CreateBy: string;
  CreateDate?: string;
  ModifiedBy?: string;
  ModifiedDate?: string;
}