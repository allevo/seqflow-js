import ts from "typescript";
import { getFileComponents } from "../src/vite-plugin";
import { readFileSync } from "node:fs";
import t from 'tap';

t.test("Normal", async (t) => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/Normal.ts";
  const output = getFileComponents(componentPath, tsConfig);

  t.matchStrict(
    output,
    [{
      name: "Normal",
      fields: {
        label: {
          name: "label",
          description: "The text",
          required: true,
          type: { t: 'basic', type: "string" }
        },
        active: {
          name: "active",
          description: "is active?",
          required: true,
          type: { t: 'basic', type: "boolean" }
        },
        size: {
          name: "size",
          description: "size in pixel",
          required: true,
          type: { t: 'basic', type: "number" }
        }
      },
    }],
  );
});

t.test("SimpleEnum", async (t) => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/SimpleEnum.ts";
  const output = getFileComponents(componentPath, tsConfig);

  t.matchStrict(
    output,
    [{
      fields: {
        strings: {
          name: "strings",
          required: false,
          description: undefined,
          type: {
            t: 'union',
            type: [
             {
               t: 'literal',
               type: 'neutral'
             },
             {
               t: 'literal',
               type: 'primary'
             },
             {
               t: 'literal',
               type: 'secondary'
             },
             {
               t: 'literal',
               type: 'accent'
             },
             {
               t: 'literal',
               type: 'ghost'
             },
             {
               t: 'literal',
               type: 'link'
             }
           ]
          },
        },
      },
      name: "SimpleEnum",
    }],
  );
});

t.test("Enum", async (t) => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/Enum.ts";
  const output = getFileComponents(componentPath, tsConfig);

  t.matchStrict(
    output,
    [{
      fields: {
        strings: {
          name: "strings",
          required: false,
          type: {
            t: "union",
            type: [
              { t: "literal", type: "neutral" },
              { t: "literal", type: "primary" },
              { t: "literal", type: "secondary" },
              { t: "literal", type: "accent" },
              { t: "literal", type: "ghost" },
              { t: "literal", type: "link" }
            ]
          }
        },
        numbers: {
          name: "numbers",
          required: false,
          type: {
            t: "union",
            type: [
              { t: "literal", type: "1" },
              { t: "literal", type: "2" },
              { t: "literal", type: "3" },
              { t: "literal", type: "4" }
            ]
          }
        },
        booleans: {
          name: "booleans",
          required: false,
          type: {
            t: "union",
            type: [
              { t: "literal", type: "true" },
              { t: "literal", type: "false" }
            ]
          }
        }
      },
      name: "Enum"
    }],
  );
});

t.test("ExportDefault", async () => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/ExportDefault.ts";
  const output = getFileComponents(componentPath, tsConfig);

  t.matchStrict(
    output,
    [{
      fields: {
        name: {
          name: "name",
          required: true,
          type: {
            t: "basic",
            type: "string"
          }
        }
      },
      name: "ExportDefault"
    }],
  );
});

t.test("MultipleExports", async (t) => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/MultipleExports.ts";
  const output = getFileComponents(componentPath, tsConfig);

  t.matchStrict(
    output,
    [{
      fields: {
        name: {
          name: "name",
          required: true,
          type: {
            t: "basic",
            type: "string"
          }
        }
      },
      name: "Export1"
    },{
      fields: {
        title: {
          name: "title",
          required: true,
          type: {
            t: "basic",
            type: "string"
          }
        }
      },
      name: "Export2"
    }],
  );
});

t.test("EnumOutsidePropertyAccessPropsType", async (t) => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/EnumOutsidePropertyAccessPropsType.ts";
  const output = getFileComponents(componentPath, tsConfig);

  t.matchStrict(
    output,
    [{
      fields: {
        strings: {
          name: "strings",
          required: false,
          type: {
            t: "union",
            type: [
              { t: "literal", type: "neutral" },
              { t: "literal", type: "primary" },
              { t: "literal", type: "secondary" },
              { t: "literal", type: "accent" },
              { t: "literal", type: "ghost" },
              { t: "literal", type: "link" }
            ]
          }
        },
        numbers: {
          name: "numbers",
          required: false,
          type: {
            t: "union",
            type: [
              { t: "literal", type: "1" },
              { t: "literal", type: "2" },
              { t: "literal", type: "3" },
              { t: "literal", type: "4"}
            ]
          }
        },
        booleans: {
          name: "booleans",
          required: false,
          type: {
            t: "union",
            type: [
              { t: "literal", type: "true" },
              { t: "literal", type: "false" }
            ]
          }
        }
      },
      name: "EnumOutsidePropertyAccess"
    }],
  );
});

t.test("Button", async (t) => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/Button.ts";
  const output = getFileComponents(componentPath, tsConfig);

  t.matchStrict(
    output,
    [{
      fields: {
        label: {
          name: "label",
          description: "The text",
          required: true,
          type: {
            t: "basic",
            type: "string"
          }
        },
        color: {
          name: "color",
          description: "color",
          required: false,
          type: {
            t: "union",
            type: [
              { t: "literal", type: "neutral" },
              { t: "literal", type: "primary" },
              { t: "literal", type: "secondary" },
              { t: "literal", type: "accent" },
              { t: "literal", type: "ghost" },
              { t: "literal", type: "link" }
            ]
          }
        },
        active: {
          name: "active",
          description: "is active?",
          required: false,
          type: {
            t: "basic",
            type: "boolean"
          }
        },
        state: {
          name: "state",
          required: false,
          type: {
            t: "union",
            type: [
              { t: "literal", type: "info" },
              { t: "literal", type: "success"},
              { t: "literal", type: "warning" },
              { t: "literal", type: "error"}
            ]
          }
        },
        outline: {
          name: "outline",
          required: false,
          type: {
            t: "basic",
            type: "boolean"
          }
        },
        size: {
          name: "size",
          required: false,
          type: {
            t: "union",
            type: [
              { t: "literal", type: "lg" },
              { t: "literal", type: "normal" },
              { t: "literal", type: "sm" },
              { t: "literal", type: "xs" }
            ]
          }
        },
        wide: {
          name: "wide",
          required: false,
          type: { t: "basic", type: "boolean" }
        },
        glass: {
          name: "glass",
          required: false,
          type: {
            t: "basic",
            type: "boolean"
          }
        },
        disabled: {
          name: "disabled",
          required: false,
          type: {
            t: "basic",
            type: "boolean"
          }
        },
        loading: {
          name: "loading",
          required: false,
          type: {
            t: "basic",
            type: "boolean"
          }
        }
      },
      name: "Button"
    }],
  );
});

t.test("OrSimple", async (t) => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/OrSimple.ts";
  const output = getFileComponents(componentPath, tsConfig);

  t.matchStrict(
    output,
    [{
      fields: {
        label: {
          name: "label",
          description: "the label",
          required: true,
          type: {
            t: "union",
            type: [
              { t: "basic", type: "string" },
              { t: "basic", type: "string" },
              { t: "basic", type: "boolean"}
            ]
          }
        }
      },
      name: "Or"
    }],
  );
});

t.test("Or2", async (t) => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/Or2.ts";
  const output = getFileComponents(componentPath, tsConfig);

  t.matchStrict(
    output,
    [{
      fields: {
        label: {
          name: "label",
          description: "the label",
          required: true,
          type: {
            t: "union",
            type: [
              { t: "basic", type: "string" },
              { t: "unknown", type: "JSX.Element"}
            ]
          }
        }
      },
      name: "Or2"
    }],
  );
});

t.test("FormField", async (t) => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/formField.ts";
  const output = getFileComponents(componentPath, tsConfig);

  t.matchStrict(
    output,
    [{
      fields: {
        label: {
          name: "label",
          required: true,
          type: {
            t: "union",
            type: [
              { t: "basic", type: "string" },
              { t: "unknown", type: "JSX.Element" }
            ]
          }
        },
        errorMessage: {
          name: "errorMessage",
          required: false,
          type: {
            t: "union",
            type: [
              { t: "basic", type: "string" },
              { t: "unknown", type: "JSX.Element" }
            ]
          }
        },
        size: {
          name: "size",
          required: true,
          type: {
            t: "basic",
            type: "number"
          }
        }
      },
      name: "FormField"
    }],
  );
});

t.test("function", async (t) => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/WithFunction.ts";
  const output = getFileComponents(componentPath, tsConfig);

  t.matchStrict(
    output,
    [{
      fields: {
        fn: {
          name: "fn",
          required: true,
          type: {
            t: "unknown",
            type: "Function"
          }
        }
      },
      name: "WithFunctionAsProp"
    }],
  );
});

t.test("TheComponentWithDescription", async (t) => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/TheComponentWithDescription.ts";
  const output = getFileComponents(componentPath, tsConfig);

  t.matchStrict(
    output,
    [{
      fields: {},
      description: 'the description wow!!',
      name: "TheComponentWithDescription"
    }],
    
  );
});
