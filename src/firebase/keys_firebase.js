const keys = {
    config_prod: {
        apiKey: "AIzaSyCOCb7Q_3PF4KgY0k69n1G53X0fQVG2l_M",
        authDomain: "guarding-manager.firebaseapp.com",
        databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
        projectId: "guarding-manager",
        storageBucket: "guarding-manager.appspot.com",
        messagingSenderId: "YOUR_MESSAGING_SEND_ID"
    },

    config_test : {
        apiKey: "AIzaSyBayA4a2hh03CyrJdc7Mel8JsJRaWYLhBM",
          authDomain: "gesthib-acda5.firebaseapp.com",
          databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
          projectId: "gesthib-acda5",
          storageBucket: "gesthib-acda5.appspot.com",
          messagingSenderId: "YOUR_MESSAGING_SEND_ID"
    },
    stripe_prod: {
        pk: "pk_live_NtRub653l4BgDRCKSYST9O9s00OUEvxnkb",
        tax_id: "txr_1HXUjCJfciPMt21YzJLhyPGN"
    },
    stripe_test: {
        pk: "",
        tax_id: ""
    }
}

export default {
    keys: keys
  };