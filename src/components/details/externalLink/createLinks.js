class ExternalLinksInDetailsController {
    constructor($scope) {
        self = this
        this.$scope = $scope;
        this.parentCtrl = this.parentCtrl.parentCtrl;
        this.waitForPNX()
    }


    createExternalLinks() {

        // console.log( self.parentCtrl.details )

        let identifiers = self.parentCtrl.details.filter(function (d) {
            return d.label === "identifier";
        });
        
        let creatorContributor = self.parentCtrl.details.filter(function (d) {
            return ["creator","contributor"].includes(d.label);
        });

        // console.log( identifiers[0].values[0].values );
        
        // console.log( creatorContributor );

        if (creatorContributor[0]) {
            if (creatorContributor[0].values) {
                var newCreatorContributor = creatorContributor[0].values[0].values.map(i => {
                    // console.log (i)
                    if (new RegExp("\\$\\$U").test(i)) {
                        var personIdentifiers = i.replace(/(.*)(\$\$U)([^\n]*)/, '$3').split(";"); // Dit moet nog een split op ; worden !!!!!!!!
                        personIdentifiers = personIdentifiers.map ( p => { 
                            if (new RegExp("^[ ]*orcid:").test(p)) {
                                return p.replace(/^[ ]*orcid:/,'').split(",").map ( id => {
                                    return '[<a href="https://orcid.org/' + id +'" target="_blank">ORCID<i class=\"material-icons prm-text\" style>launch</i></a>]'
                                }).join(" ");
                            }else if (new RegExp("^[ ]*researcherid:").test(p)) {
                                return p.replace(/^[ ]*researcherid:/,'').split(",").map ( id => {
                                    return '[<a href="https://www.researcherid.com/rid' + id +'" target="_blank">ResearcherID<i class=\"material-icons prm-text\" style>launch</i></a>]'
                                }).join(" ");
                            }else if (new RegExp("^[ ]*staff_nr:").test(p)) {
                                return p.replace(/^[ ]*staff_nr:/,'').split(",").map ( id => {
                                    return '[<a href="https://www.kuleuven.be/wieiswie/en/person/' + id +'" target="_blank">KU Leuven ID<i class=\"material-icons prm-text\" style>launch</i></a>]'
                                }).join(" ");                                
                            }else{
                                return p
                            }
                        })
                        
                        // console.log ( "personIdentifiers" );
                        // console.log ( personIdentifiers.join(" ") );
                        return i.replace(/(.*)(\$\$Q.*)(\$\$U)([^\n]*)/, '$1$2'+'$$$$U'+personIdentifiers.join(" ") )
                    } else {
                        return i;
                    }
                }); 
                creatorContributor[0].values[0].values = newCreatorContributor
            }
        }

        
        
        if (identifiers[0]) {
            if (identifiers[0].values) {

                var newIdentifiers = identifiers[0].values[0].values.map(i => {
                    if (new RegExp(" \\$\\$CDOI: ").test(i)) {
                        return i.replace(/( \$\$CDOI: \$\$V)([^\n ]*)/, '$1<a href="https://doi.org/$2" target="_blank">$2 <i class=\"material-icons prm-text\" style>launch</i></a>');
                    } else {
                        return i;
                    }
                });

                //console.log( newIdentifiers );

                identifiers[0].values[0].values = newIdentifiers
            }
        }

    }


    waitForPNX() {
        let detailsWatcher = self.$scope.$watch(() =>
            self.parentCtrl.details,
            (newVal, oldVal) => {
                if (newVal) {
                   if (newVal[0]) {
                        detailsWatcher();
                        this.createExternalLinks()
                    }
                }
            }
        );
    }

}
ExternalLinksInDetailsController.$inject = ['$scope'];

export let externalLinksInDetailscomponent = {
    name: 'custom-external-link',
    enabled: true,
    appendTo: 'prm-service-details-after',
    enableInView: '.*',
    config: {
        bindings: { parentCtrl: '<' },
        controller: ExternalLinksInDetailsController,
        template: ''
    }
}
