class SparkcentralController {

    constructor($scope, $http, $translate, $rootScope) {
        var self = this;
        self.$scope = $scope;
        self.$http = $http;
        
        console.log($scope);
        
        self.$rootScope = $rootScope;
        self.locale = $scope.$root.$$childHead.$ctrl.userSessionManagerService.i18nService.getLanguage() || "en";
        
        Primo.view.then((view) => {
            let locale = view.interfaceLanguage;
            
            Sparkcentral.init({
                appId: '5e2af1872e81a50010fa5f95',
                region: 'eu-1',
                locale: 'nl-BE',
                soundNotificationEnabled: true,
                customColors: {
                    brandColor: '328eb0',
                    conversationColor: '328eb0',
                    actionColor: '65beec',
                },
                customText: {
                    conversationTimestampHeaderFormat: 'DD MMMM YYYY, H:mm',
                    introductionText: 'Chat met een medewerker van KU Leuven Bibliotheken op werkdagen tussen 9:00 en 16:00. / Chat with a staff member of KU Leuven Libraries on working days between 9 AM and 4 PM.',
                    headerText: 'Heb je een vraag? / Do you have a question?',               
                    inputPlaceholder: 'Typ hier je boodschap / Please type your message',
                    messageSending: 'Verzenden... / Sending...',
                    sendButtonText: 'Verzenden / Send',
                    uploadPhoto: 'Upload een foto / Upload a picture',
                    shareLocation: 'Deel je locatie / Share your location',
                    uploadDocument: 'Upload een document / Upload a document',
                },
                buttonIconUrl: 'https://admin.kuleuven.be/icts/servicepunt/images/chaticoontje.gif',
                businessName: 'KU Leuven Bibliotheken',
                businessIconUrl: 'https://bib.kuleuven.be/rbib/afbeeldingen/chat-logo-bib.png',
                backgroundImageUrl: 'http://stijl.kuleuven.be/2016/img/sedes-kuleuven.png',
                menuItems: {
                    imageUpload: 'Yes',
                    fileUpload: 'Yes',
                    shareLocation: 'Yes'
                }
            })
            .then(function() {
                // Your code after init is complete
            });
        
        });      
       
    }
     
    $onInit() {
        
    }

    $onDestroy() {
        Sparkcentral.destroy();
    }
}

SparkcentralController.$inject = ['$scope'];

export let sparkcentralComponent = {
    name: 'custom-sparkcentral',
    enabled: true,
    appendTo: 'prm-account-after',
    enableInView: '32KUL_KUL:(KULeuven|REGIONAL).*',
    config: {
        bindings: {
            parentCtrl: '<'
        },
        controller: SparkcentralController
    }
}