import User from "./user";
import View from "./view";
import Records from "./records";
import Facets from './facets';

import Bridge from './core/angular/bridge';
import Component from './core/angular/component';

export default class Primo {
    get version() {
        let _version = "0.0.1";
        return `Library:${_version} - ALMA:${window.appConfig['system-configuration'].Alma_Version}`;
    }

    get user() {  
        return new Promise((resolve, reject) => {
            resolve(new User());
        })  
        // return User;
    }

    get view() {
        return new Promise((resolve, reject) => {
            resolve(new View());
        })
    }

    get records() {
        return new Promise((resolve, reject) => {
            resolve(new Records());
        })
    }

    get facets() {
        return new Promise((resolve, reject) => {
            resolve(new Facets());
        })
    }

    get components() {
        return Component;
    }

    get bridge() {
        return Bridge;
    }
}
