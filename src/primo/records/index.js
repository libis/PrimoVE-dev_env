import Bridge from '../core/angular/bridge';

export default class Records {
    constructor() {
        return this._items();
    }

    _items() {
        try {
            return Bridge.userSessionManagerService.searchStateService.resultObject.data;
        } catch(e){
            console.log('Unable to retrieve records');
        }

        return [];
    }
}