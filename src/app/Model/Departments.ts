export interface IDepartment {
    DeptId: number;
    DeptName: string;
    Description: string;
    IsActive: boolean;
    CreateBy: string;
    CreateDate?: string;
    ModifiedBy?: string;
    ModifiedDate?: string;
}