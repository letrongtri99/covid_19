import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { UserModel } from '../../_models/user.model';
import { environment } from '../../../../../environments/environment';


const API_AUTH_URL = `${environment.apiUrl}/auth`;
const API_USERS_URL = `${environment.apiUrl}/user`;

@Injectable({
	providedIn: 'root',
})
export class AuthHTTPService {
	constructor(private http: HttpClient) { }

	/**
	 * Call api to login
	 * @param (string) email - email of user
	 * @param(string) password - password of user want to login
	 * @return (Observable) 
	 */
	login(email: string, password: string): Observable<any> {
		return this.http.post(`${API_AUTH_URL}/login`, { email, password }, { withCredentials: true, observe: 'response' });
	}

	createUser(user: UserModel): Observable<UserModel> {
		return this.http.post<UserModel>(API_USERS_URL, user, { withCredentials: true });
	}

	/* Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false */
	forgotPassword(email: string): Observable<boolean> {
		return this.http.post<boolean>(`${API_AUTH_URL}/forgot-password`, {
			email,
		});
	}

	/** 
	 * Get current user information by token stored in cookies
	 * @return (Observable)
	 */
	getUserByToken(): Observable<any> {
		return this.http.get(`${API_AUTH_URL}/getCurrentUser`, { withCredentials: true, observe: 'response' });
	}

	saveUpdateInfor(user: UserModel): Observable<UserModel> {
		return this.http.post<UserModel>(`${API_AUTH_URL}/updateUserInfor`, user, { withCredentials: true });
	}

	changePassword(login: any): Observable<any> {
		return this.http.post<any>(`${API_AUTH_URL}/changePassword`, login, { withCredentials: true });
	}

	/** 
	 * Post logout
	 * @return (Observable)
	 */
	logout(): Observable<any> {
		return this.http.post(`${API_AUTH_URL}/logout`, {}, { withCredentials: true, observe: 'response' });
	}
}
