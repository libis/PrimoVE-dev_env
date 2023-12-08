import Session from '../../primo/session'

class PayFinesMessageController {
  constructor($translate, MessageService) {
    let self = this;
    self.user = Session.user;    
    
    if (self.user.fines.length > 0) {
      //TODO:extract html to its own file. find out how to resolve {{}}

      let message = $translate.instant('nui.customization.fines.youHaveFines');
      message = message.replace(/\$0/, user.fines.length);

      let pay = $translate.instant('nui.customization.fines.pay');
      
      MessageService.show(`
          <span style="align-self:center;">${message}</span>
          <a style="background-color: tomato;color: white;"
              class="md-button md-raised md-secundary" target='_blank'
              href='https://services.libis.be/pay_my_fines'>${pay}</a>
        `);
    }
  }
}

PayFinesMessageController.$inject = ['$translate', 'MessageService'];

export let payFinesMessageComponent = {
  name: 'custom-pay-fines-message',  
  enabled: true,
  appendTo: 'prm-top-bar-before',
  enableInView: '32KUL_KUL:.*',  
  config: {
    bindings: {parentCtrl: '<'},
    controller: PayFinesMessageController,
    template: ''
  }
}
