export const topics = [
  {
    id: "ts-intro",
    title: "Introduction to TypeScript",
    description:
      "Why TypeScript? Understanding the move from JavaScript, installation, and compilation.",
    icon: "FileCode",
    sections: [
      {
        id: "drawbacks-js",
        title: "Drawbacks of JS & The Move to TS",
        content: `
JavaScript is amazing, but it has inherent issues that become apparent in large-scale applications:

1.  **Loose Types**: Variables can change types dynamically, leading to unexpected runtime errors.
2.  **Loose Documentation**: Without types, function signatures don't tell you what they expect or return. You often have to read the implementation.
3.  **Developer Tooling**: JS autocomplete is good, but TS is superior. TS provides instant feedback on available properties and methods.
4.  **Freedom**: JS allows you to do anything (e.g., accessing non-existent properties), which often leads to "undefined is not a function".

**TypeScript** solves these by adding a static type system on top of JavaScript. It catches errors at **compile time** rather than **runtime**.
        `,
        code: `// JavaScript
function add(a, b) {
  return a + b;
}
console.log(add("1", 2)); // "12" - No error, but likely not intended

// TypeScript
function addTs(a: number, b: number): number {
  return a + b;
}
// console.log(addTs("1", 2)); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.`,
      },
      {
        id: "what-is-ts",
        title: "What is TypeScript?",
        content: `
TypeScript is a **superset** (or "Addon") to JavaScript. This means:
*   All valid JavaScript is valid TypeScript.
*   TypeScript adds new features (Types, Interfaces, Enums, Generics) on top of JS.
*   Browsers **cannot** execute TypeScript directly. It must be compiled (transpiled) down to JavaScript.

**The Process:**
1.  **TS Code**: You write \`.ts\` files with types.
2.  **Compiler (tsc)**: The TypeScript compiler parses the code, creates an **Abstract Syntax Tree (AST)**, checks for type errors, and transforms it.
3.  **JS Code**: The output is clean JavaScript that browsers/Node.js can run.
        `,
        diagram: `
graph LR
    A[TypeScript Code .ts] -->|tsc Compiler| B(Abstract Syntax Tree & Type Checking)
    B -->|Transpilation| C[JavaScript Code .js]
    C -->|Execution| D[Browser / Node.js]
        `,
      },
      {
        id: "installation",
        title: "Installation & Setup",
        content: `
You can install TypeScript globally or locally within a project.

**Global Installation:**
Useful for running \`tsc\` from anywhere.
\`npm install -g typescript\`

**Project-wise Installation (Recommended):**
Ensures all developers use the same TS version.
\`npm install --save-dev typescript\`

**Initialization:**
Create a \`tsconfig.json\` file to configure the compiler.
\`npx tsc --init\`
        `,
        code: `// Check version
tsc -v

// Compile a specific file
tsc index.ts

// Compile entire project (based on tsconfig.json)
tsc`,
      },
    ],
  },
  {
    id: "ts-basics",
    title: "Type System Fundamentals",
    description: "Core concepts: Inference, Annotations, and Basic Types.",
    icon: "Type",
    sections: [
      {
        id: "inference-annotation",
        title: "Type Inference vs Annotation",
        content: `
**Type Annotation**: Explicitly telling TS what type a variable is.
**Type Inference**: TS automatically guesses the type based on the assigned value.
        `,
        code: `// Type Annotation
let username: string = "Alice";
let age: number = 30;

// Type Inference
let country = "USA"; // TS infers 'string'
// country = 10; // Error: Type 'number' is not assignable to type 'string'.`,
      },
      {
        id: "basic-types",
        title: "Basic Types & Special Types",
        content: `
TypeScript introduces several special types beyond standard JS types.

*   **Union Types (\`|\`)**: A value can be one of multiple types.
*   **\`any\`**: Disables type checking. "Farak nahi padtha" (Doesn't matter). Avoid using this!
*   **\`unknown\`**: Safer version of \`any\`. You must check the type before using it.
*   **\`void\`**: Represents the absence of a value (usually for functions that don't return anything).
*   **\`never\`**: Represents values that never occur (e.g., functions that throw errors or infinite loops).
*   **\`undefined\` & \`null\`**: Subtypes of all other types (depending on \`strictNullChecks\`).
        `,
        code: `// Union
let id: number | string;
id = 101;
id = "EMP-101";

// Any (Avoid)
let data: any = 5;
data = "Hello"; // No error

// Unknown (Safer)
let input: unknown = 5;
// let num: number = input; // Error: Type 'unknown' is not assignable to type 'number'.
if (typeof input === 'number') {
    let num: number = input; // OK
}

// Void
function logMessage(msg: string): void {
    console.log(msg);
}

// Never
function throwError(msg: string): never {
    throw new Error(msg);
}`,
      },
      {
        id: "arrays-tuples-enums",
        title: "Arrays, Tuples, & Enums",
        content: `
**Arrays**: Lists of a specific type.
**Tuples**: Fixed-length arrays where each element has a specific type.
**Enums**: A set of named constants.
        `,
        code: `// Arrays
let skills: string[] = ["JS", "TS", "React"];
let scores: Array<number> = [10, 20, 30];
let readonlyArr: ReadonlyArray<string> = ["A", "B"];
// readonlyArr.push("C"); // Error

// Multidimensional Array
let matrix: number[][] = [[1, 2], [3, 4]];

// Tuples
let user: [number, string] = [1, "Admin"];
// user = ["Admin", 1]; // Error: Order matters

// Enums
enum Role {
    ADMIN,
    USER,
    GUEST
}
let currentRole: Role = Role.ADMIN; // 0`,
      },
    ],
  },
  {
    id: "ts-advanced-types",
    title: "Advanced Types & Manipulation",
    description: "Narrowing, Guards, Aliases, and Assertions.",
    icon: "Code2",
    sections: [
      {
        id: "narrowing-guards",
        title: "Type Narrowing & Guards",
        content: `
**Type Narrowing**: The process of refining a broad type (like \`unknown\` or \`string | number\`) to a specific type.

*   **\`typeof\`**: For primitives (string, number, boolean).
*   **\`instanceof\`**: For class instances.
*   **Type Guards**: Custom functions that return a type predicate (\`arg is Type\`).
*   **Optional Chaining (\`?\`)**: Safely accessing properties.
        `,
        code: `// typeof
function printId(id: string | number) {
    if (typeof id === "string") {
        console.log(id.toUpperCase()); // TS knows it's a string here
    } else {
        console.log(id.toFixed(2)); // TS knows it's a number here
    }
}

// instanceof
class Dog { bark() {} }
class Cat { meow() {} }
function handlePet(pet: Dog | Cat) {
    if (pet instanceof Dog) {
        pet.bark();
    }
}

// Custom Type Guard
function isString(test: any): test is string {
    return typeof test === "string";
}`,
      },
      {
        id: "type-aliases",
        title: "Type Aliases & Objects",
        content: `
**Type Aliases (\`type\`)**: Creating a custom name for a type.
**Object Types**: Defining the shape of an object.
        `,
        code: `type UserID = string | number;

type User = {
    id: UserID;
    name: string;
    email?: string; // Optional property
    readonly role: string; // Cannot be changed
};

const u1: User = {
    id: 1,
    name: "John",
    role: "Admin"
};
// u1.role = "User"; // Error: Cannot assign to 'role' because it is a read-only property.`,
      },
      {
        id: "assertions-casting",
        title: "Type Assertions & Casting",
        content: `
Sometimes you know more about a value's type than TypeScript does. You can use **Type Assertion** to tell TS "Trust me, I know what I'm doing".

*   **\`as\` syntax**: \`value as Type\`
*   **Angle bracket syntax**: \`<Type>value\` (Not compatible with JSX)
*   **Forceful Assertion**: \`value as unknown as Type\` (Double casting)
        `,
        code: `// DOM Elements
const input = document.getElementById("user-input") as HTMLInputElement;
console.log(input.value); // OK

// JSON.parse
const jsonString = '{"name": "Alice", "age": 25}';
type Person = { name: string; age: number };
const user = JSON.parse(jsonString) as Person;

// Forceful (Use with caution)
let str = "hello";
let num = str as unknown as number; // Force string to number`,
      },
    ],
  },
  {
    id: "ts-interfaces-oop",
    title: "Interfaces & OOP",
    description: "Structuring data with Interfaces and Classes.",
    icon: "Box",
    sections: [
      {
        id: "interfaces",
        title: "Interfaces",
        content: `
**Interfaces** define the structure of an object. They are very similar to Type Aliases but are better for defining object shapes and can be extended.

*   **Extending**: Interfaces can extend other interfaces.
*   **Merging**: Two interfaces with the same name merge automatically.
*   **Index Signatures**: For objects with dynamic keys.
        `,
        code: `interface Animal {
    name: string;
}

interface Bear extends Animal {
    honey: boolean;
}

const bear: Bear = { name: "Pooh", honey: true };

// Index Signature
interface StringArray {
    [index: number]: string;
}
const myArray: StringArray = ["Bob", "Fred"];

// Merging (Declaration Merging)
interface Box { height: number; }
interface Box { width: number; }
// Box now has both height and width`,
      },
      {
        id: "utility-types",
        title: "Utility Types",
        content: `
TypeScript provides built-in utilities to transform types.

*   **\`Partial<T>\`**: Makes all properties optional.
*   **\`Required<T>\`**: Makes all properties required.
*   **\`Pick<T, K>\`**: Picks a set of properties.
*   **\`Omit<T, K>\`**: Removes a set of properties.
        `,
        code: `interface Todo {
    title: string;
    description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
    return { ...todo, ...fieldsToUpdate };
}

type TodoPreview = Pick<Todo, "title">;
type TodoInfo = Omit<Todo, "description">;`,
      },
      {
        id: "classes-oop",
        title: "Classes & Access Modifiers",
        content: `
TypeScript adds full OOP support with access modifiers.

*   **\`public\`**: Accessible everywhere (default).
*   **\`private\`**: Accessible only within the class.
*   **\`protected\`**: Accessible within the class and subclasses.
*   **\`implements\`**: Enforcing a class to follow an interface.
        `,
        code: `interface Shape {
    getArea(): number;
}

class Rectangle implements Shape {
    public constructor(
        protected width: number, 
        protected height: number
    ) {}

    public getArea(): number {
        return this.width * this.height;
    }
}

class Square extends Rectangle {
    constructor(side: number) {
        super(side, side);
    }
}`,
      },
    ],
  },
  {
    id: "ts-generics-tooling",
    title: "Generics & Tooling",
    description: "Reusable code with Generics and Type Declarations.",
    icon: "Settings",
    sections: [
      {
        id: "generics",
        title: "Generics <T>",
        content: `
**Generics** allow you to create reusable components that work with a variety of types rather than a single one. It's like a variable for types.
        `,
        code: `// Generic Function
function identity<T>(arg: T): T {
    return arg;
}

let output1 = identity<string>("myString");
let output2 = identity<number>(100);

// Generic Interface
interface Box<T> {
    contents: T;
}
let stringBox: Box<string> = { contents: "Hello" };

// Generic Constraints
function logLength<T extends { length: number }>(arg: T): T {
    console.log(arg.length);
    return arg;
}`,
      },
      {
        id: "error-handling",
        title: "Error Handling (try-catch)",
        content: `
In TypeScript, the error object in a \`catch\` block is of type \`unknown\` or \`any\`. You should handle it safely.
        `,
        code: `try {
    // ... risky code
} catch (error) {
    if (error instanceof Error) {
        console.log(error.message);
    } else {
        console.log("An unexpected error occurred");
    }
}`,
      },
      {
        id: "declarations",
        title: "Type Declarations (.d.ts)",
        content: `
**Declaration Files (\`.d.ts\`)** provide type information for JavaScript libraries that don't have built-in TS support. They contain only type definitions, no implementation.

They enable:
*   IntelliSense (Hints)
*   Type Checking for external libraries
        `,
        code: `// example.d.ts
declare module "some-library" {
    export function doSomething(a: string): number;
}

// Usage in .ts file
import { doSomething } from "some-library";
doSomething("hello"); // TS knows this returns a number`,
      },
    ],
  },
  {
    id: "ts-advanced-types-deep-dive",
    title: "Deep Dive: Advanced Types",
    description: "Mastering Mapped, Conditional, and Template Literal Types.",
    icon: "Cpu",
    sections: [
      {
        id: "keyof-typeof",
        title: "Keyof & Typeof Operators",
        content: `
**keyof**: Extracts the keys of an object type as a union of string literals.
**typeof**: Captures the type of an existing variable or object.
        `,
        code: `type User = { id: number; name: string; };
type UserKeys = keyof User; // "id" | "name"

const config = { port: 3000, host: "localhost" };
type Config = typeof config; // { port: number; host: string; }`,
      },
      {
        id: "mapped-types",
        title: "Mapped Types",
        content: `
**Mapped Types** allow you to create new types by iterating over keys of an existing type.
Syntax: { [P in K]: T }
        `,
        code: `type Options = {
  darkMode: boolean;
  saveData: boolean;
};

// Make all properties boolean and readonly
type ReadonlyBools<T> = {
  readonly [P in keyof T]: boolean;
};

type Config = ReadonlyBools<Options>;
// { readonly darkMode: boolean; readonly saveData: boolean; }`,
      },
      {
        id: "conditional-types",
        title: "Conditional Types",
        content: `
**Conditional Types** select one of two types based on a condition.
Syntax: T extends U ? X : Y
        `,
        code: `type IsString<T> = T extends string ? "Yes" : "No";

type A = IsString<string>; // "Yes"
type B = IsString<number>; // "No"

// Extract type from Promise
type Unpack<T> = T extends Promise<infer U> ? U : T;
type Result = Unpack<Promise<string>>; // string`,
      },
      {
        id: "template-literal-types",
        title: "Template Literal Types",
        content: `
Build types using string literal syntax. Useful for defining patterns.
        `,
        code: `type Color = "red" | "blue";
type Quantity = "one" | "two";

type Item = \`\${Quantity}-\${Color}\`;
// "one-red" | "one-blue" | "two-red" | "two-blue"`,
      },
    ],
  },
  {
    id: "ts-decorators",
    title: "Decorators",
    description:
      "Meta-programming with Class, Method, and Property decorators.",
    icon: "Stamp",
    sections: [
      {
        id: "decorators-intro",
        title: "Decorators Overview",
        content: `
Decorators provide a way to add annotations and a meta-programming syntax for class declarations and members.
*Requires experimentalDecorators: true in tsconfig.json.*
        `,
        code: `function Logger(target: Function) {
  console.log("Class loaded:", target.name);
}

@Logger
class User {
  constructor() {}
}`,
      },
      {
        id: "method-decorators",
        title: "Method Decorators",
        content: `
Applied to the Property Descriptor for the method. Can be used to observe, modify, or replace a method definition.
        `,
        code: `function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(\`Calling \${propertyKey} with\`, args);
    return original.apply(this, args);
  };
}

class Calculator {
  @Log
  add(a: number, b: number) {
    return a + b;
  }
}`,
      },
    ],
  },
  {
    id: "ts-modules-namespaces",
    title: "Modules vs Namespaces",
    description: "Organizing code effectively.",
    icon: "Package",
    sections: [
      {
        id: "modules-vs-namespaces",
        title: "Modules vs Namespaces",
        content: `
**Modules (ESM)**: The modern standard. File-based scope. Use import and export.
**Namespaces**: TypeScript-specific internal modules. Used to group code globally.
**Recommendation**: Always use **Modules** for modern application development. Use Namespaces only for legacy code or complex type definitions (.d.ts).
        `,
        code: `// Module (Recommended)
// math.ts
export function add(x: number, y: number) { return x + y; }
// app.ts
import { add } from "./math";

// Namespace (Legacy/Specific use)
namespace MathUtils {
    export function subtract(x: number, y: number) { return x - y; }
}
/// <reference path="MathUtils.ts" />
MathUtils.subtract(10, 5);`,
      },
    ],
  },
  {
    id: "ts-configuration",
    title: "Configuration & Tooling",
    description: "Mastering tsconfig.json.",
    icon: "Settings",
    sections: [
      {
        id: "tsconfig-deep-dive",
        title: "tsconfig.json Deep Dive",
        content: `
The tsconfig.json file controls how TypeScript compiles your code.
*   **target**: JS version to output (e.g., "ES6", "ES2020").
*   **module**: Module system (e.g., "CommonJS", "ESNext").
*   **strict**: Enables all strict type-checking options.
*   **outDir**: Where to place compiled files.
        `,
        code: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "outDir": "./dist",
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"]
    }
  }
}`,
      },
    ],
  },
  {
    id: "ts-modern-features",
    title: "Modern Features",
    description: "New operators and assertions.",
    icon: "Sparkles",
    sections: [
      {
        id: "satisfies-operator",
        title: "The 'satisfies' Operator",
        content: `
Validates that an expression matches a type, **without** widening the type of the expression.
        `,
        code: `type Colors = "red" | "green" | "blue";
type RGB = [number, number, number];

const palette = {
    red: [255, 0, 0],
    green: "00ff00",
    blue: [0, 0, 255]
} satisfies Record<Colors, string | RGB>;

// TS knows 'red' is an array, and 'green' is a string!
palette.red.map(x => x * 2); // OK
palette.green.toUpperCase(); // OK`,
      },
      {
        id: "const-assertions",
        title: "Const Assertions",
        content: `
**as const**: Tells TS that the expression is immutable.
1.  Primitives become literal types.
2.  Arrays become readonly tuples.
3.  Objects get readonly properties.
        `,
        code: `const config = {
    endpoint: "https://api.example.com",
    retries: 3
} as const;

// config.endpoint is type "https://api.example.com" (not string)
// config.retries is type 3 (not number)
// config.retries = 4; // Error`,
      },
    ],
  },
];
