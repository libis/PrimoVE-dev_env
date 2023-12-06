# PrimoVE-dev_env en functie-branches 

Ontwikkelingen aan https://github.com/libis/PrimoVE-dev_env verlopen best via functie-branches. 
De ontwikkelingen gebeuren meestal lokaal, inclusief het testen via yarn … en localhost.  Na het lokaal testen worden er package aangemaakt om op te laden in Alma/Primo-sandbox omgeving(en) zodat andere de nieuwe functie in de PrimoVe-sandbox omgeving kunnen testen. Als alles goed is bevonden kan de nieuwe functie worden opgenomen in de package(s) van productie.

Het gebruik van functie-branches beperkt het overschrijven van functies die werden aangemaakt door medeontwikkelaars bij het opladen van packages.

Voor elke nieuwe ontwikkeling wordt er een functie-branch aangemaakt. Deze branch is gebaseerd op de meest recente main-branch (productie), in sommige omstandigheden kan dit ook vanaf de sandbox-branch. 

```
git switch main
git checkout -b [name_of_your_new_branch]
git push origin [name_of_your_new_branch]
```

Als het lokaal testen de gewenste resultaten geeft, kan alles naar github worden doorgestuurd.
In github kan er dan een pull request worden aangevraagd naar sandbox. Hopelijk geeft deze pull request niet al te veel conflicten. Het aanmaken van de package voor sandbox gebeurt in de sandbox-branch nadat deze werd geüpdatet vanuit de repository zodat de pull request ook lokaal beschikbaar is.

```
git switch sandbox
git fetch
```

De sandbox zal dus alle functies bevatten die op dat moment ‘getest’ worden op Alma/Primo-sandbox. Als de functie is goed gekeurd, kan dit via een pull request van de functie-branch naar de main-branch. Ook hier hopelijk zonder al te veel conflicten. Als er toch nog issues zouden opduiken kan de functie eventueel terug worden verwijderd via de revert-knop.
Na enkele dagen, weken of maanden kan de functie branch worden verwijderd. 

