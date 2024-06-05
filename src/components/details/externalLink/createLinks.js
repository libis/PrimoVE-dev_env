class ExternalLinksInDetailsController {

    constructor($scope) {
        this.$scope = $scope;
    }

    $onInit() {
        let self = this;
        self.parentCtrl = this.parentCtrl.parentCtrl;
        this.waitForPNX()
    }

    createExternalLinks() {
        let self = this;
        // console.log( self.parentCtrl.details )
        // console.log( self.parentCtrl )

        let identifiers = self.parentCtrl.details.filter(function (d) {
            return d.label === "identifier";
        });
        
        let creatorContributor = self.parentCtrl.details.filter(function (d) {
            return ["creator","contributor"].includes(d.label);
        });

        let relatedwork = self.parentCtrl.details.filter(function (d) {
            return ["relatedwork"].includes(d.label);
        });

        /* ALos check PrimoVE-dev_env\resources\32KUL_KUL-Lirias\js\templates\full-view-details-service-details.html */

        if (relatedwork.length > 0) {
            relatedwork = relatedwork.map ( relatedwork => {
                relatedwork.values = relatedwork.values.map ( rw => {
                    rw["isLinkable"] = true;
                    rw["facetField"] =  undefined;
                    rw["isFacetExact"] = false;
                    rw["isLinkable"] = true;
                    rw["key"] =  "any";
                    rw["keyt"] =  "any";
                    rw["operator"] =  "exact";
                    return rw
                })
                return relatedwork
            })
        }


        // console.log( identifiers[0].values[0].values );
        
        //console.log( creatorContributor );

        if (creatorContributor.length > 0) {
            creatorContributor = creatorContributor.map ( persontype => {
                persontype.values = persontype.values.map ( person => {
                    person.values = person.values.map(i => {
                        //console.log ("["+i+"]");
                        if (new RegExp(" \\$\\$U").test(i)) {
                            var personIdentifiers = i.replace(/(.*)( \$\$U)([^\n]*)/, '$3').split(";");
                            //console.log ("personIdentifiers:" + personIdentifiers)
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
                            return i.replace(/(.*)(\$\$Q.*)[/s]{0,1}( \$\$U)([^\n]*)/,'$1$2'+'$$$$U'+ personIdentifiers.join(" ") )
                        } else {
                            return i;
                        }
                    });
                    return person
                })
                return persontype
            });
        }
        
        
        if (identifiers[0]) {
            if (identifiers[0].values) {

                var newIdentifiers = identifiers[0].values[0].values.map(i => {
                    if (new RegExp(" \\$\\$CDOI: ").test(i)) {
                        return i.replace(/( \$\$CDOI: \$\$V)([^\n ]*)/, '$1<a href="https://doi.org/$2" target="_blank">$2 <i class=\"material-icons prm-text\" style>launch</i></a>');
                    } else if (new RegExp(" \\$\\$CSCOPUSID: ").test(i)) {
                        return i.replace(/( \$\$CSCOPUSID: \$\$V)([^\n ]*)/, '$1<a href="https://www.scopus.com/record/display.uri?eid=$2&origin=resultslist" target="_blank">$2 <i class=\"material-icons prm-text\" style>launch</i></a>');
                    } else if (new RegExp(" \\$\\$CPMID: ").test(i)) {
                        return i.replace(/( \$\$CPMID: \$\$V)([^\n ]*)/, '$1<a href="https://pubmed.ncbi.nlm.nih.gov/$2/" target="_blank">$2 <i class=\"material-icons prm-text\" style>launch</i></a>');
                    } else {
                        return i;
                    }
                });
                //console.log( newIdentifiers );
                identifiers[0].values[0].values = newIdentifiers
            }
        }

        var s = document.createElement("link");
        s.setAttribute("id", 'style_material_icons');
        s.setAttribute("href", 'https://fonts.googleapis.com/icon?family=Material+Icons');
        s.setAttribute("rel", 'stylesheet');
        document.getElementsByTagName("primo-explore")[0].appendChild(s);

    }


    waitForPNX() {
        let self = this;
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
