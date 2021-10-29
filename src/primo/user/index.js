import JWT from '../core/jwt';
import Fines from './fines';
import Loans from './loans';
import Session from './session';


export default class User {
    constructor() {
        let data = this.__build();
        return data;
    }

    async __build() {        
        let jwt = new JWT();
        let session = await new Session();
        let fines = await new Fines();
        let loans = await new Loans();

        let data = {
            id: jwt.user || '',
            email: session.email || '',
            name: jwt.userName || 'Guest',
            display_name: session.display_name,
            isLoggedIn: () => session.isLoggedIn,
            isOnCampus: () => jwt.onCampus == "true" ? true : false,
            fines: fines,
            loans: loans
        };
        return data;
    }
}