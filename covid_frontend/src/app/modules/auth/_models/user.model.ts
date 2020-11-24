import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';

export class UserModel {
	id: number;
	uuid: string;
	password: string;
	first_name: string;
	last_name: string;
	facility_name: string
	city: string;
	role: number;
	state: string;
	zip: string;
	phone_number: string;
	user_created: string;
	status: number;
	created_at: string;
	updated_at: string;
	email: string;
	pic: string;
	last_login: string;
	last_ip_address: string;
	name: string;
	
	setUser(user: any) {
		this.id = user.id;
		this.uuid = user.uuid;
		this.password = user.password || '';
		this.email = user.email || '';
		this.first_name = user.first_name || '';
		this.last_name = user.last_name || '';
		this.pic = user.pic || './assets/media/users/default.jpg';
		this.role = user.role || null;
		this.facility_name = user.facility_name || '';
		this.city = user.city || '';
		this.phone_number = user.phone_number || '';
		this.state = user.state || '';
		this.status = user.status;
		this.zip = user.zip || '';
		this.created_at = user.created_at || '';
		this.updated_at = user.updated_at || '';
		this.user_created = user.user_created || '';
		this.last_login = user.last_login || '';
		this.last_ip_address = user.last_ip_address || '';
	}
}
