import Session from "../../primo/session";

class PayFinesMessageController {
  constructor($translate, MessageService) {
    const self = this;

    // console.log("PayFinesMessageController loaded");

    self.user = Session.user;

    self.user.fines.then((fines) => {
      // console.log("All fines:", fines);

      self.fines = fines.filter((fine) => fine.finestatus === "ACTIVE");

      // console.log("Active fines:", self.fines);

      if (self.fines.length > 0) {
        let message = $translate.instant(
          "nui.customization.fines.youHaveFines",
        );

        message = message.replace(/\$0/, self.fines.length);

        let pay = $translate.instant("nui.customization.fines.pay");

        MessageService.show(`
           <span style="align-self:center;">
             ${message}
           </span>
 
           <button
             id="pay-fines-btn"
             style="
               background-color: tomato;
               color: white;
               margin-left: 10px;
             "
             class="md-button md-raised md-secondary">
             ${pay}
           </button>
         `);

        // console.log("Message shown");

        const findButton = setInterval(() => {
          const btn = document.getElementById("pay-fines-btn");

          // console.log("Looking for button...", btn);

          if (!btn) {
            return;
          }

          clearInterval(findButton);

          // console.log("BUTTON FOUND");

          btn.addEventListener("click", async () => {
            // console.log("PAY BUTTON CLICKED");

            try {
              // console.log("Getting Angular injector...");

              const injector = angular
                .element(document.querySelector("primo-explore"))
                .injector();

              const rootScope = injector.get("$rootScope");

              const uSMS =
                rootScope.$$childHead.$ctrl.userSessionManagerService;

              // console.log("uSMS:", uSMS);

              let token = uSMS.jwtUtilService.getJwtFromLocalStorage();

              // console.log("Raw JWT:", token);

              if (!token) {
                // console.error("No JWT found");
                return;
              }

              token = token.replace(/^"|"$/g, "");

              // console.log("JWT length:", token.length);

              const webhookUrl =
                "https://eu-workflows.hosted.exlibrisgroup.com/19868343-9f49-454d-b9b5-84e5dba9923f/webhook/a027a91c-6603-49b1-b35b-87d70efc4bfb";

              // console.log("Calling webhook:", webhookUrl);

              const response = await fetch(webhookUrl, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              // console.log("Response status:", response.status);

              // const text = await response.text();
              const data = await response.json();

              // console.log("Response data:", data);

              if (data.action === "REDIRECT" && data.url) {
                window.location.href = data.url;
              }

              // console.log("Response body:", data);
            } catch (error) {
              // console.error("Payment workflow failed:", error);
            }
          });
        }, 500);
      }
    });
  }
}

PayFinesMessageController.$inject = ["$translate", "MessageService"];

export let payFinesMessageComponent = {
  name: "custom-pay-fines-message",
  enabled: true,
  appendTo: "prm-top-bar-before",
  enableInView: "^32KUL_KUL:KULeuven$",
  config: {
    bindings: { parentCtrl: "<" },
    controller: PayFinesMessageController,
    template: "",
  },
};
