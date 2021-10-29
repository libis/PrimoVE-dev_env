import Bridge from '../../core/angular/bridge'

export default class Loans {
    constructor() {
        return Bridge.userLoans();
    }
}