import Bridge from '../../core/angular/bridge'

export default class Fines {
    constructor() {
        return Bridge.userFines();        
    }
}