export interface IEmployeeProjects{
    id: number;
    employeeId : number;
    projectId : number;
    AssignDate : string;
    isActive : boolean;
    createBy : string;
    createDate : string;
    modifiedDate? : string;
    modifiedBy? : string;

}