export interface IProject {
    ProjectId: number;
    ProjectName: string;
    Description: string;
    IsActive: boolean;
    CreateBy: string;
    CreateDate: string;
    ModifiedDate?: string;
    ModifiedBy?: string;
}