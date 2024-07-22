import ts from "typescript";
import { foo } from "../src/vite-plugin";
import { readFileSync } from "node:fs";
import t from "node:test";
import assert from "node:assert";

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
          description: undefined,
          name: "booleans",
          type: {
            name: "boolean",
            required: false,
          },
        },
        numbers: {
          control: {
            type: "select",
          },
          description: undefined,
          name: "numbers",
          options: [1, 2, 3, 4],
          type: {
            name: "number",
            required: false,
          },
        },
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
          description: undefined,
          name: "name",
          type: {
            name: "string",
            required: true,
          },
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
          description: undefined,
          name: "name",
          type: {
            name: "string",
            required: true,
          },
        },
      },
    }, {
      componentName: "Export2",
      fields: {
        title: {
          description: undefined,
          name: "title",
          type: {
            name: "string",
            required: true,
          },
        },
      },
    }],
    output
  );
});

t.test("EnumOutside", { skip: true }, () => {
  const { config: tsConfig } = ts.readConfigFile("./tsconfig.json", (p) =>
    readFileSync(p, "utf8")
  );

  const componentPath = "./tests/fixtures/EnumOutside.ts";
  const output = foo(componentPath, tsConfig);

  assert.deepStrictEqual(
    [{
      componentName: "Export1",
      fields: {
        name: {
          description: undefined,
          name: "name",
          type: {
            name: "string",
            required: true,
          },
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
        },
        color: {
          control: {
            type: "select",
          },
          description: "color",
          name: "color",
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
        disabled: {
          description: undefined,
          name: "disabled",
          type: {
            name: "boolean",
            required: false,
          },
        },
        glass: {
          description: undefined,
          name: "glass",
          type: {
            name: "boolean",
            required: false,
          },
        },
        label: {
          description: "The text",
          name: "label",
          type: {
            name: "string",
            required: true,
          },
        },
        loading: {
          description: undefined,
          name: "loading",
          type: {
            name: "boolean",
            required: false,
          },
        },
        outline: {
          description: undefined,
          name: "outline",
          type: {
            name: "boolean",
            required: false,
          },
        },
        size: {
          control: {
            type: "select",
          },
          description: undefined,
          name: "size",
          options: ["lg", "normal", "sm", "xs"],
          type: {
            name: "string",
            required: false,
          },
        },
        state: {
          control: {
            type: "select",
          },
          description: undefined,
          name: "state",
          options: ["info", "success", "warning", "error"],
          type: {
            name: "string",
            required: false,
          },
        },
        wide: {
          description: undefined,
          name: "wide",
          type: {
            name: "boolean",
            required: false,
          },
        },
      },
    }],
    output
  );
});
