import Bridge from '../core/angular/bridge';
import JWT from '../core/jwt';

export default class View {
    constructor() {
        return this.__build();
    }

    __build() {
        let uSms = Bridge.userSessionManagerService;
        let jwt = new JWT();

        let data = {
            code: jwt.viewId || window.appConfig['vid'],
            institution: {
                code: jwt.viewInstitutionCode,
                name: window.appConfig['primo-view']['attributes-map'].institution
            },
            interfaceLanguage: uSms.getUserLanguage() || window.appConfig['primo-view']['attributes-map'].interfaceLanguage,
            ip: (jwt.ip || jwt.userIp)            
        }

        return data;
    }
}