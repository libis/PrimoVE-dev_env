import Component from '../component';

export default class Bridge {
  static get app() {
    let primoExplore = Component.element('primo-explore');
    return primoExplore && primoExplore.length > 0 ? primoExplore[0] : null;
  }

  static get injector() {
    let app = this.app;

    if (app) {
      let injector = angular.element(app).injector();
      if (injector) {
        return injector;
      }
    }

    return null;
  }

  static get http() {
    let injector = this.injector;
    if (injector) {
      let h = injector.get('$http');
      if (h) {
        return h;
      }
    }

    return null;
  }

  static rootScope() {
    let injector = this.injector;
    if (injector) {
      let rootScope = injector.get('$rootScope');
      if (rootScope) {
        return rootScope;
      }
    }

    return null;
  }

  static get userSessionManagerService() {
    let rootScope = this.rootScope();
    if (rootScope) {
      return rootScope.$$childHead.$ctrl.userSessionManagerService;
    }

    return null;
  }

  static get jwtData() {
    let uSMS = this.userSessionManagerService;
    if (uSMS) {
      let jwtData = uSMS.jwtUtilService.getDecodedToken() || {};
      return jwtData;
    }
  }

  static get restBaseURLs() {
    return this.injector.get('restBaseURLs')
  }

  static get viewCode() {
    return this.jwtData.viewId || window.appConfig['vid'];
  }

  static async userDetails() {
    let viewCode = this.viewCode;
    let details = await this.http.get(`${this.restBaseURLs.userSettingsBaseURL}?vid=${viewCode}`);

    return details.data;
  }

  static async userFines() {
    let userFines = await this.http.get(`${this.restBaseURLs.myAccountBaseURL}/fines`);

    try {
      let data = userFines.data;
      if (data.status == 'ok') {
        let fines = data.data.fines;
        return fines.fine;
      } else {
        console.log('No fines');
        return [];
      }
    }
    catch (error) {
      return [];
    }
  }

  static async userLoans() {
    let userLoans = await this.http.get(`${this.restBaseURLs.myAccountBaseURL}/loans`);
    try {
      let data = userLoans.data;
      if (data.status == 'ok') {
        let loans = data.data.loans;
        return loans.loan;
      } else {
        console.log('No loans');
        return [];
      }
    }
    catch (error) {
      return [];
    }
  }

}