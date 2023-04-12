class SparkcentralController {

    constructor($scope, $http, $translate, $rootScope) {
        var self = this;
        self.$scope = $scope;
        self.$http = $http;
        
        console.log($scope);
        
        self.$rootScope = $rootScope;
        self.locale = $scope.$root.$$childHead.$ctrl.userSessionManagerService.i18nService.getLanguage() || "en";
        
        Primo.view.then((view) => {
            //let vid = view.code;
            
            let locale = view.interfaceLanguage;

            if(locale == "nl"){
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
                        introductionText: 'Chat met een medewerker van KU Leuven Bibliotheken op werkdagen tussen 9:00 en 16:00.',
                        headerText: 'Heb je een vraag?',               
                        inputPlaceholder: 'Typ hier je boodschap',
                        messageSending: 'Verzenden...',
                        sendButtonText: 'Verzenden',
                        uploadPhoto: 'Upload een foto',
                        shareLocation: 'Deel je locatie',
                        uploadDocument: 'Upload een document',
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
            }else{
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
                        introductionText: 'Chat with a staff member of KU Leuven Libraries on working days between 9 AM and 4 PM.',                
                        headerText: 'Do you have a question?',
                        inputPlaceholder: 'Please type your message',
                        messageSending: 'Sending...',
                        sendButtonText: 'Send',
                        uploadPhoto: 'Upload a picture',
                        shareLocation: 'Share your location',
                        uploadDocument: 'Upload a document',
                    },
                    buttonIconUrl: 'https://admin.kuleuven.be/icts/servicepunt/images/chaticoontje.gif',
                    businessName: 'KU Leuven Libraries',
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
            }
        });       
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