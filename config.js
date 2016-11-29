System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "typescript",
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  packages: {
    "lib": {
      "defaultExtension": "ts"
    },
    "app": {
      "defaultExtension": "ts"
    }
  },

  map: {
    "CustomComponent": "lib/Bindings/ComponentBindings/CustomComponent",
    "Injector": "lib/Injector",
    "Router": "lib/Router/Router",
    "text": "github:systemjs/plugin-text@0.0.8",
    "twbs/bootstrap": "github:twbs/bootstrap@3.3.6",
    "typescript": "npm:typescript@1.8.10",
    "github:jspm/nodelibs-os@0.1.0": {
      "os-browserify": "npm:os-browserify@0.1.2"
    },
    "github:twbs/bootstrap@3.3.6": {
      "jquery": "npm:jquery@2.2.4"
    },
    "npm:os-browserify@0.1.2": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:typescript@1.8.10": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    }
  }
});
