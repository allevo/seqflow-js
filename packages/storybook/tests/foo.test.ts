import ts from "typescript";
import { foo } from "../src/vite-plugin";
import { readFileSync } from "node:fs";
import t from "node:test";
import assert from "node:assert";

t.test("Normal", () => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/Normal.ts";
  const output = foo(componentPath, tsConfig);

  assert.deepStrictEqual(
    [{
      componentName: "Normal",
      fields: {
        label: {
          name: "label",
          description: 'The text',
          type: {
            name: "string",
            required: true,
          },
          control: { type: 'text' },
          options: undefined,
        },
        size: {
          name: "size",
          description: 'size in pixel',
          type: {
            name: "number",
            required: true,
          },
          control: { type: 'number' },
          options: undefined,
        },
        active: {
          name: "active",
          description: 'is active?',
          type: {
            name: "boolean",
            required: true,
          },
          control: { type: "boolean" },
          options: undefined,
        },
      },
    }],
    output
  );
});

t.test("SimpleEnum", () => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/SimpleEnum.ts";
  const output = foo(componentPath, tsConfig);

  assert.deepStrictEqual(
    [{
      componentName: "SimpleEnum",
      fields: {
        strings: {
          control: {
            type: "select",
          },
          description: undefined,
          name: "strings",
          options: [
            "neutral",
            "primary",
            "secondary",
            "accent",
            "ghost",
            "link",
          ],
          type: {
            name: "string",
            required: false,
          },
        },
      },
    }],
    output
  );
});

t.test("Enum", () => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/Enum.ts";
  const output = foo(componentPath, tsConfig);

  assert.deepStrictEqual(
    [{
      componentName: "Enum",
      fields: {
        booleans: {
          name: "booleans",
          description: undefined,
          type: {
            name: "boolean",
            required: false,
          },
          control: { type: 'boolean' },
          options: undefined,
        },
        numbers: {
          name: "numbers",
          description: undefined,
          type: {
            name: "number",
            required: false,
          },
          control: {
            type: "select",
          },
          options: ['1', '2', '3', '4'],
          
        },
        strings: {
          name: "strings",
          description: undefined,
          type: {
            name: "string",
            required: false,
          },
          control: {
            type: "select",
          },
          options: [
            "neutral",
            "primary",
            "secondary",
            "accent",
            "ghost",
            "link",
          ],
        },
      },
    }],
    output
  );
});

t.test("ExportDefault", () => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/ExportDefault.ts";
  const output = foo(componentPath, tsConfig);

  assert.deepStrictEqual(
    [{
      componentName: "ExportDefault",
      fields: {
        name: {
          name: "name",
          description: undefined,
          type: {
            name: "string",
            required: true,
          },
          control: { type: 'text' },
          options: undefined,
        },
      },
    }],
    output
  );
});

t.test("MultipleExports", () => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/MultipleExports.ts";
  const output = foo(componentPath, tsConfig);

  assert.deepStrictEqual(
    [{
      componentName: "Export1",
      fields: {
        name: {
          name: "name",
          description: undefined,
          type: {
            name: "string",
            required: true,
          },
          control: { type: 'text' },
          options: undefined
        },
      },
    }, {
      componentName: "Export2",
      fields: {
        title: {
          name: "title",
          description: undefined,
          type: {
            name: "string",
            required: true,
          },
          control: { type: 'text' },
          options: undefined
        },
      },
    }],
    output
  );
});

t.test("EnumOutsidePropertyAccessPropsType", { skip: false }, () => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/EnumOutsidePropertyAccessPropsType.ts";
  const output = foo(componentPath, tsConfig);

  assert.deepStrictEqual(
    [{
      componentName: "EnumOutsidePropertyAccess",
      fields: {
        strings: {
          name: "strings",
          description: undefined,
          type: {
            name: "string",
            required: false,
          },
          control: {
            type: "select",
          },
          options: [
            "neutral",
            "primary",
            "secondary",
            "accent",
            "ghost",
            "link",
          ],
        },
        numbers: {
          name: "numbers",
          description: undefined,
          type: {
            name: "number",
            required: false,
          },
          control: {
            type: "select",
          },
          options: ['1', '2', '3', '4'],
        },
        booleans: {
          name: "booleans",
          description: undefined,
          type: {
            name: "boolean",
            required: false,
          },
          control: {
            type: "boolean",
          },
          options: undefined,
        },
      },
    }],
    output
  );
});

t.test("Button", () => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/Button.ts";
  const output = foo(componentPath, tsConfig);

  assert.deepStrictEqual(
    [{
      componentName: "Button",
      fields: {
        active: {
          description: "is active?",
          name: "active",
          type: {
            name: "boolean",
            required: false,
          },
          control: { type: 'boolean' },
          options: undefined,
        },
        color: {
          name: "color",
          description: "color",
          type: {
            name: "string",
            required: false,
          },
          control: {
            type: "select",
          },
          options: [
            "neutral",
            "primary",
            "secondary",
            "accent",
            "ghost",
            "link",
          ],
          
        },
        disabled: {
          name: "disabled",
          description: undefined,
          type: {
            name: "boolean",
            required: false,
          },
          control: { type: 'boolean' },
          options: undefined,
        },
        glass: {
          name: "glass",
          description: undefined,
          type: {
            name: "boolean",
            required: false,
          },
          control: { type: 'boolean' },
          options: undefined,
        },
        label: {
          name: "label",
          description: "The text",
          type: {
            name: "string",
            required: true,
          },
          control: { type: 'text' },
          options: undefined,
        },
        loading: {
          name: "loading",
          description: undefined,
          type: {
            name: "boolean",
            required: false,
          },
          control: { type: 'boolean' },
          options: undefined,
        },
        outline: {
          name: "outline",
          description: undefined,
          type: {
            name: "boolean",
            required: false,
          },
          control: { type: 'boolean' },
          options: undefined,
        },
        size: {
          name: "size",
          description: undefined,
          type: {
            name: "string",
            required: false,
          },
          control: {
            type: "select",
          },
          options: ["lg", "normal", "sm", "xs"],
        },
        state: {
          name: "state",
          description: undefined,
          type: {
            name: "string",
            required: false,
          },
          control: {
            type: "select",
          },
          options: ["info", "success", "warning", "error"],
          
        },
        wide: {
          name: "wide",
          description: undefined,
          type: {
            name: "boolean",
            required: false,
          },
          control: { type: 'boolean' },
          options: undefined,
        },
      },
    }],
    output
  );
});

t.test("OrSimple", () => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/OrSimple.ts";
  const output = foo(componentPath, tsConfig);

  assert.deepStrictEqual(
    [{
      componentName: "Or",
      fields: {
        label: {
          name: 'label',
          description: 'the label',
          type: {
            name: 'union',
            required: true,
            value: [
              {
                name: 'string'
              },
              {
                name: 'number'
              },
              {
                name: 'boolean'
              }
            ]
          },
          control: undefined,
          options: undefined
        }
      },
    }],
    output
  );
});

t.test("Or2", () => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/Or2.ts";
  const output = foo(componentPath, tsConfig);

  assert.deepStrictEqual(
    [{
      componentName: "Or2",
      fields: {
        label: {
          description: 'the label',
          name: 'label',
          type: {
            name: 'union',
            required: true,
            value: [
              {
                name: 'string'
              },
              {
                name: 'other',
                value: 'JSX.Element'
              }
            ]
          },
          control: undefined,
          options: undefined
        }
      },
    }],
    output
  );
});

t.test("FormField", () => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/formField.ts";
  const output = foo(componentPath, tsConfig);

  assert.deepStrictEqual(
    [{
      componentName: "FormField",
      fields: {
        label: {
          name: 'label',
          description: undefined,
          type: {
            name: 'union',
            required: true,
            value: [
              {
                name: 'string'
              },
              {
                name: 'other',
                value: 'JSX.Element'
              }
            ]
          },
          control: undefined,
          options: undefined
        },
        errorMessage: {
          name: 'errorMessage',
          description: undefined,
          type: {
            name: 'union',
            required: false,
            value: [
              {
                name: 'string'
              },
              {
                name: 'other',
                value: 'JSX.Element'
              }
            ]
          },
          control: undefined,
          options: undefined,
        },
        size: {
          name: 'size',
          description: undefined,
          type: {
            name: 'number',
            required: true,
          },
          control: { type: 'number' },
          options: undefined,
        },
      },
    }],
    output
  );
});

t.test("function", () => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/WithFunction.ts";
  const output = foo(componentPath, tsConfig);

  assert.deepStrictEqual(
    [{
      componentName: "WithFunctionAsProp",
      fields: {},
    }],
    output
  );
});