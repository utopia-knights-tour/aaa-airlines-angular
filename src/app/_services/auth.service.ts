import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models/user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public isLoggedIn: boolean;

    // Always contains the current user.
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email, password) {
        return this.http.post<any>('https://meksvi4fnh.execute-api.us-east-1.amazonaws.com/dev/login', { email, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                console.log(user);
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    getCustomerByUserId(userId) {
        return this.http.get<any>(`http://52.91.174.134:3000/customer/customer?userId=${userId}`)
    }
}
