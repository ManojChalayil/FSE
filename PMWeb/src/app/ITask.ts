export interface ITask
{
    TaskId: number,
    ParentTaskId: number,
    ProjectId: number,
    TaskName: string,
    StartDate: Date,
    EndDate: Date,
    Priority: number,
    Status: string
}