export class AuthModel {
	access_token: string;
	refresh_token: string;
	expiresIn: Date;

	setAuth(auth: any) {
		this.access_token = auth.access_token;
		this.refresh_token = auth.refresh_token;
		this.expiresIn = auth.expiresIn;
	}
}
