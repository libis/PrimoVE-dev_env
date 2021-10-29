import Bridge from '../../core/angular/bridge'

export default class Session {
    constructor() {
        return this.__build();
    }

    async __build() {
        let uSms = Bridge.userSessionManagerService;
        let details = await Bridge.userDetails();

        let data = {            
            email: details.email || '',            
            display_name: uSms.getUserNameForDisplay(),
            isLoggedIn: () => uSms.getUserName().length > 0,
        };

        return data;
    }
}