import { Injectable } from '@angular/core';
import { IProject } from 'src/app/IProject';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap, first } from 'rxjs/operators';
import { IParentTask } from 'src/app/IparentTask';
import { IUser } from 'src/app/IUser';
import { ITask } from 'src/app/ITask';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    private projectUrl = "http://localhost:8090/api/projects";
    private parentTaskUrl = "http://localhost:8090/api/parenttasks";
    private saveProjectUrl = "http://localhost:8090/api/saveproject";
    private userUrl = "http://localhost:8090/api/user";
    private saveTaskUrl = "http://localhost:8090/api/savetask";
    private endTaskUrl = "http://localhost:8090/api/endtask";
    private taskUrl = "http://localhost:8090/api/task";
    private gettaskUrl = "http://localhost:8090/api/gettask";
    private saveUserUrl = "http://localhost:8090/api/saveuser";
    private getUserUrl = "http://localhost:8090/api/getuser";
    private deleteUserUrl = "http://localhost:8090/api/deleteuser";
    private deleteProjectUrl = "http://localhost:8090/api/deleteproject";
    _router: Router;
    constructor(private http: HttpClient, router: Router) {
        this._router = router;
    }

    GetProjects(): Observable<IProject[]> {
        console.log('came to get project');
        return this.http.get<IProject[]>(this.projectUrl)
            .pipe(tap(data => console.log(data)), catchError(this.handleError))
    }

    GetParentTasks(): Observable<IParentTask[]> {
        return this.http.get<IParentTask[]>(this.parentTaskUrl)
            .pipe(tap(data => console.log(data)), catchError(this.handleError))
    }

    GetUser(): Observable<IUser[]> {
        return this.http.get<IUser[]>(this.userUrl)
            .pipe(tap(data => console.log(data)), catchError(this.handleError))
    }

    GetTask(): Observable<ITask[]> {
        return this.http.get<ITask[]>(this.taskUrl)
            .pipe(tap(data => console.log(data)), catchError(this.handleError))
    }

    GetTaskList(): Observable<ITask[]> {
        return this.http.get<ITask[]>(this.gettaskUrl)
            .pipe(tap(data => console.log(data)), catchError(this.handleError))
    }

    GetUserList(): Observable<IUser[]> {
        return this.http.get<IUser[]>(this.getUserUrl)
            .pipe(tap(data => console.log(data)), catchError(this.handleError))
    }

    private handleError(err: HttpErrorResponse) {
        return throwError("error thrown");
    }
    //projects: IProject[] = [];
    SaveProject(projectName: string, startDate: Date, endDate: Date
        , priority: number): Observable<any> {
        
        const headers = new HttpHeaders({ 'Content-Type':  'application/json' });
        console.log('calling save project');
        
        var prjJson = {projectName:"'" + projectName + "'"
                        ,startDate:"'" + startDate + "'"
                        ,endDate:"'" + endDate + "'" 
                        ,priority:"'" + priority + "'"};
        let bodystr = JSON.stringify(prjJson);

        return this.http.post(this.saveProjectUrl , bodystr,
            { headers: headers });
            // .toPromise()
            // .then((data:any) => {
            //     console.log("came after save");
            //     // return this.http.get<IProject[]>(this.projectUrl)
            //     //         .pipe(tap(data => console.log(data)), catchError(this.handleError));
            // });


            // .subscribe(
            //     res => {console.log(res); },
            //     err => { console.log(err)},
            //     () => { 
            //         return this.http.get<IProject[]>(this.projectUrl)
            //         .subscribe(res => {
            //             this.projects.push(...res);
            //             console.log("with in get project afer save");
            //             console.log(res);
            //             return this.projects;
            //         });
                        
            //         //.pipe(tap(data => console.log(data)), catchError(this.handleError));
            //     });
            //return this.projects;
    }

    SaveTask(parentTaskId: number, projectId: number
        , taskName: string, startDate: Date, endDate: Date
        , priority: number, status: string
        , user: number): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        console.log('calling save task');
        
        return this.http.post(this.saveTaskUrl + "?parentTaskId=" + parentTaskId + "&projectId=" + projectId + "&taskName=" + taskName + "&startDate=" + startDate + "&endDate=" + endDate + "&priority=" + priority + "&status=" + status ,
        { headers: headers });
    }

    EndTask(taskId: number): boolean {
        const headers = new HttpHeaders({ 'Content-Type':  'application/json' });
        console.log('calling save task');
        
        var tskJson = {taskId:"'" + taskId + "'"};             
        let bodystr = JSON.stringify(tskJson);

        this.http.post<any>(this.endTaskUrl , bodystr, 
        { headers: headers }).subscribe(
            res => {
                //console.log(res);
            }
        );

        return true;
    }
 
    SaveUser(firstName: string, lastName: string, projectId: number
        , taskId:number ): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        console.log('calling save user');
        
        return this.http.post(this.saveUserUrl + "?firstName=" + firstName + "&lastName=" + lastName + "&projectId=" + projectId + "&taskId=" + taskId ,
        { headers: headers });
        // .subscribe(
        //     res => {
        //         //console.log(res);
        //     }
        // );

        // return true;
    }

    DeleteUser(userId: number): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        console.log('calling delete user');
        return this.http.post(this.deleteUserUrl + "?userId=" + userId,
        { headers: headers });
        // .subscribe(
        //     res => {
        //         //console.log(res);
        //     }
        // );

        //return true;
    }

    DeleteProject(projectId: number): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        console.log('calling delete project');
        return this.http.post(this.deleteProjectUrl + "?projectId=" + projectId,
        { headers: headers });
        
    }
  
}



