export const topics = [
  {
    id: "introduction",
    title: "Introduction",
    description: "Foundational concepts for the ultimate JavaScript revision.",
    icon: "BookOpen", // Lucide icon name
    sections: [
      {
        id: "what-is-js",
        title: "What is JavaScript?",
        content: `
JavaScript is a high-level, interpreted (or JIT-compiled) programming language that conforms to the ECMAScript specification. It's the engine of the modern web.

### Key Characteristics:
1. **Single-threaded**: Executes one command at a time.
2. **Synchronous**: Code is executed in order (top to bottom).
3. **Weakly Typed**: Variables are not bound to a specific data type.
4. **Dynamic**: Objects and functions can be modified at runtime.
5. **Multi-paradigm**: Supports OOP, Functional, and Imperative styles.

Wait, if it's single-threaded, how does it handle async tasks? That's where the **Event Loop** comes in (covered later).
        `,
        code: `// Simple Hello World
console.log("Hello, World!");

// Dynamically typed
let x = 10;
x = "Now I am a string";
console.log(x);`,
      },
    ],
  },
  {
    id: "internals",
    title: "JS Engine Internals",
    description:
      "Deep dive into Execution Context, Call Stack, and how JS works under the hood.",
    icon: "Cpu",
    sections: [
      {
        id: "execution-context",
        title: "Execution Context",
        content: `
Everything in JavaScript happens inside an **Execution Context**.

It has two components:
1. **Memory Component (Variable Environment)**: Where variables and functions are stored as key-value pairs.
2. **Code Component (Thread of Execution)**: Where code is executed line by line.

There are two types of contexts:
- **Global Execution Context (GEC)**: Created when the script starts.
- **Function Execution Context (FEC)**: Created when a function is invoked.
        `,
        diagram: `
graph TD
    subgraph ExecutionContext [Execution Context]
    direction TB
    A[Memory Component] -- "Key : Value" --> B(Variable Environment)
    C[Code Component] -- "Line by Line" --> D(Thread of Execution)
    end
        `,
        code: `var n = 2;
function square(num) {
  var ans = num * num;
  return ans;
}
var square2 = square(n);
var square4 = square(4);

/*
Execution Steps:
1. Memory Phase: 
   - n: undefined
   - square: function definition
   - square2: undefined
   - square4: undefined

2. Code Execution Phase:
   - n = 2
   - square(n) invoked -> New Execution Context created!
*/`,
      },
      {
        id: "call-stack",
        title: "The Call Stack",
        content: `
The **Call Stack** manages the Execution Contexts. It follows the **LIFO** (Last In, First Out) principle.

1. When JS starts, it pushes the **Global Execution Context** (GEC) onto the stack.
2. When a function is called, its **Function Execution Context** (FEC) is pushed onto the stack.
3. When the function returns, its FEC is popped off.
        `,
        diagram: `
graph BT
    subgraph CallStack [Call Stack]
        C[subFunction Context]
        B[square Context]
        A[Global Execution Context]
    end
    A --> B
    B --> C
        `,
        code: `function a() {
  console.log("Inside a");
  b(); // Code waits here until b() finishes
  console.log("a finished");
}

function b() {
  console.log("Inside b");
}

a();

/*
Stack Operations:
1. Push GEC
2. Call a() -> Push a() Context
3. Call b() -> Push b() Context
4. b() done -> Pop b()
5. a() done -> Pop a()
*/`,
      },
      {
        id: "memory-management",
        title: "Memory Management & GC",
        content: `
JavaScript automatically allocates memory when objects are created and frees it when they are no longer used (**Garbage Collection**).

### Memory Life Cycle:
1. **Allocation**: Memory is allocated by the engine.
2. **Usage**: Reading and writing to the allocated memory.
3. **Release**: Memory is released when no longer needed.

### Garbage Collection (Mark-and-Sweep):
The main algorithm used by modern engines.
1. **Mark**: The GC starts from "roots" (global object) and marks all objects that are reachable.
2. **Sweep**: It then "sweeps" through memory and removes any objects that were not marked.

### Memory Leaks:
Common causes:
- **Accidental Globals**: Variables declared without \`let\`/\`const\`.
- **Forgotten Timers**: \`setInterval\` not cleared.
- **Closures**: Holding onto large objects in parent scope.
- **Out of DOM references**: Keeping references to deleted DOM nodes.
        `,
        diagram: `
graph TD
    Root[Root: Global Object] --> A[Object A]
    Root --> B[Object B]
    A --> C[Object C]
    D[Object D: Unreachable]
    
    subgraph GC [Garbage Collector]
        M[Mark Reachable]
        S[Sweep Unmarked]
    end
    
    M -.-> A
    M -.-> B
    M -.-> C
    S -.-> D
        `,
      },
      {
        id: "modern-js",
        title: "Modern JS (ES6+)",
        content: `
ES6 (ECMAScript 2015) introduced significant features that changed how we write JavaScript.

### Key Features:
1. **Let & Const**: Block-scoped variable declarations.
2. **Arrow Functions**: Concise syntax and lexical \`this\`.
3. **Template Literals**: String interpolation with backticks.
4. **Destructuring**: Extracting values from arrays/objects.
5. **Classes**: Syntactic sugar over prototypal inheritance.

### Spread & Rest Operators (\`...\`)
The \`...\` syntax can be used in two different ways depending on context:

#### 1. Spread Operator (Expand)
Expands an iterable (like an array) into individual elements.

**Use Cases**:
- **Merging Arrays**: \`[...arr1, ...arr2]\`
- **Cloning Arrays/Objects**: \`const copy = [...arr]\` (Shallow copy)
- **Passing Arguments**: \`Math.max(...numbers)\`

#### 2. Rest Operator (Gather)
Collects multiple elements and "condenses" them into a single array element. It must be the **last** element.

**Use Cases**:
- **Function Arguments**: \`function sum(...args) { }\`
- **Destructuring**: \`const [first, ...rest] = [1, 2, 3]\`
        `,
        code: `// --- SPREAD ---
const parts = ['shoulders', 'knees'];
const lyrics = ['head', ...parts, 'and', 'toes'];
console.log(lyrics); 
// ["head", "shoulders", "knees", "and", "toes"]

const obj1 = { foo: 'bar', x: 42 };
const obj2 = { foo: 'baz', y: 13 };
const merged = { ...obj1, ...obj2 };
console.log(merged); 
// { foo: "baz", x: 42, y: 13 } (Last key wins)

// --- REST ---
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3)); // 6

const [first, ...others] = [1, 2, 3, 4];
console.log(first); // 1
console.log(others); // [2, 3, 4]`,
      },
    ],
  },
  {
    id: "basics",
    title: "Variables & Hoisting",
    description: "Scope, hoisting, and the temporal dead zone.",
    icon: "Box",
    sections: [
      {
        id: "hoisting",
        title: "Hoisting",
        content: `
**Hoisting** is the phenomenon where variable and function declarations are moved to the top of their scope during the Memory Phase (before execution).

### Rules:
1. **Function Declarations**: Are fully hoisted. You can call them before defining them.
2. **Var**: Hoisted but initialized with \`undefined\`.
3. **Let/Const**: Hoisted but stay in the **Temporal Dead Zone (TDZ)** until the line of initialization. Accessing them before throws a ReferenceError.
        `,
        diagram: `
graph TD
    subgraph MemoryPhase [Phase 1: Memory Allocation]
        A["var x = undefined"]
        B["function getName() { ... }"]
        C["let y = (Uninitialized / TDZ)"]
    end
    
    subgraph ExecutionPhase [Phase 2: Code Execution]
        D["console.log(x) -> undefined"]
        E["getName() -> Executes"]
        F["console.log(y) -> ReferenceError"]
    end
    
    MemoryPhase --> ExecutionPhase
        `,
        code: `getName(); // Works! "Namaste JavaScript"
console.log(x); // undefined
console.log(y); // ReferenceError: Cannot access 'y' before initialization

var x = 7;
function getName() {
  console.log("Namaste JavaScript");
}
let y = 10;`,
      },
      {
        id: "scope-chain",
        title: "Scope Chain & Lexical Environment",
        content: `
**Scope** is where you can access a specific variable.
**Lexical Environment** = Local Memory + Reference to Lexical Environment of Parent.

When the JS engine searches for a variable:
1. It looks in the **Current Scope**.
2. If not found, it goes to the **Parent's Lexical Environment**.
3. It repeats this until the Global Scope (or null).

This chain of references is the **Scope Chain**.
        `,
        diagram: `
graph TD
    subgraph GlobalScope [Global Scope]
        G_VAR[Var x]
        subgraph FunctionA [Function a Scope]
            A_VAR[Var b]
            subgraph FunctionC [Function c Scope]
               C_LOG["console.log(b)"]
            end
        end
    end
    
    C_LOG -- "Looks for b" --> FunctionC
    FunctionC -- "Not found" --> FunctionA
    FunctionA -- "Found b!" --> A_VAR
        `,
        code: `function a() {
  var b = 10;
  c();
  function c() {
    console.log(b); // Found in parent (a)
  }
}

a();
// console.log(b); // Error: b is not defined in global`,
      },
    ],
  },
  {
    id: "functions",
    title: "Functions Deep Dive",
    description: "Closures, Callbacks, and High Order Functions.",
    icon: "Code",
    sections: [
      {
        id: "closures",
        title: "Closures",
        content: `
A **closure** is created when a function is defined inside another function, and the inner function **remembers and can access variables** from the outer function **even after the outer function has finished executing**.

> ✅ In short: **Function + its surrounding data = Closure**

### 🧠 Visual Mental Model
\`\`\`
outer() execution
 ├─ count = 0
 └─ inner() → remembers count
         ↓
   counter() → modifies count
\`\`\`

### 🔁 Private Variable (Real Use Case)
Closures are perfect for data hiding and encapsulation.
\`\`\`js
function bankAccount(initialBalance) {
  let balance = initialBalance;

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      balance -= amount;
      return balance;
    }
  };
}

const account = bankAccount(1000);
console.log(account.deposit(500));  // 1500
console.log(account.withdraw(200)); // 1300
\`\`\`

### 🛑 Without Closure (Problem Example)
Without closures, variables might need to be global, which is risky as anyone can modify them.
\`\`\`js
let balance = 1000;

function deposit(amount) {
  balance += amount;
}
// ❌ Anyone can modify balance directly
\`\`\`

### ⏱️ Closure in Loops (Common Interview Question)
#### ❌ Problem
\`\`\`js
for (var i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Output: 4, 4, 4
\`\`\`

#### ✅ Fix using Closure
\`\`\`js
for (var i = 1; i <= 3; i++) {
  (function(x) {
    setTimeout(() => console.log(x), 1000);
  })(i);
}
// Output: 1, 2, 3
\`\`\`

### 🧪 Closure Example in Python
\`\`\`python
def outer():
    count = 0

    def inner():
        nonlocal count
        count += 1
        return count

    return inner

counter = outer()
print(counter())  # 1
print(counter())  # 2
\`\`\`

### 🎯 Key Takeaways
- Closure **remembers variables** even after function execution.
- Used for: **Data hiding**, **Counters**, **Memoization**, **Event handlers**, **Callbacks**.

### 💡 One-Line Definition
> **A closure is a function that retains access to its lexical scope even when executed outside that scope.**
        `,
        code: `function outer() {
  let count = 0;        // outer variable

  function inner() {   // inner function
    count++;
    return count;
  }

  return inner;
}

const counter = outer();

console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3`,
      },
      {
        id: "callbacks",
        title: "Callback Functions",
        content: `
A function passed into another function as an argument is a **Callback Function**. This is powerful for asynchronous operations.

**Pitfalls**:
- **Callback Hell**: Recursively nested callbacks making code unreadable.
- **Inversion of Control**: You lose control of when/if the callback executes (e.g., inside a third-party library).
        `,
        code: `// Async callback example
setTimeout(function() {
  console.log("Timer");
}, 5000);

function x(y) {
  console.log("x");
  y();
}
x(function y() {
  console.log("y");
});`,
      },
      {
        id: "hof",
        title: "Higher Order Functions",
        content: `
A **Higher Order Function** is a function that takes another function as an argument OR returns a function.
Common examples: \`map\`, \`filter\`, \`reduce\`.
        `,
        code: `const radius = [3, 1, 2, 4];

const area = function(radius) {
  return Math.PI * radius * radius;
};

const calculate = function(arr, logic) {
  const output = [];
  for(let i = 0; i < arr.length; i++) {
    output.push(logic(arr[i]));
  }
  return output;
};

console.log(calculate(radius, area)); // Re-implementation of .map()`,
      },
    ],
  },
  {
    id: "advanced-js",
    title: "Advanced JS Concepts",
    description: "Closures, Prototypes, and the 'this' keyword.",
    icon: "Zap",
    sections: [
      {
        id: "closures",
        title: "Closures",
        content: `
A **Closure** is a function that remembers its outer variables even after the outer function has finished executing.

### Key Points:
- Functions in JS are bundled with their lexical environment.
- Closures allow for **Data Encapsulation** (private variables).
- They are used in factories, decorators, and event handlers.
        `,
        code: `function outer() {
  let count = 0;
  return function inner() {
    count++;
    console.log(count);
  };
}

const counter = outer();
counter(); // 1
counter(); // 2`,
        diagram: `
graph LR
    subgraph LexicalEnvironment [Lexical Environment]
        V[Variable: count]
    end
    F[Inner Function] --> LexicalEnvironment
        `,
      },
      {
        id: "this-keyword",
        title: "The 'this' Keyword",
        content: `
The value of **this** is determined by *how* a function is called (Execution Context).

1. **Global Context**: \`window\` (browser) or \`global\` (Node).
2. **Method Call**: The object before the dot.
3. **Constructor Call**: The new object being created.
4. **Arrow Functions**: Inherit \`this\` from their lexical parent (they don't have their own \`this\`).
5. **Explicit Binding**: Using \`call()\`, \`apply()\`, or \`bind()\`.
        `,
        code: `const obj = {
  name: "Alice",
  print: function() {
    console.log(this.name);
  }
};

obj.print(); // Alice

const printName = obj.print;
printName(); // undefined (or error in strict mode)`,
      },
      {
        id: "prototypes",
        title: "Prototypes & Inheritance",
        content: `
Every object in JS has a built-in property called its **Prototype**. Objects inherit properties and methods from their prototype.

- **Prototypal Chain**: If a property isn't found on an object, JS looks at its prototype, then the prototype's prototype, until it reaches \`null\`.
- **__proto__**: The actual object used in the lookup chain.
- **prototype**: A property on constructor functions used to set the \`__proto__\` of new instances.
        `,
        code: `const animal = { eats: true };
const dog = { barks: true };

Object.setPrototypeOf(dog, animal);

console.log(dog.barks); // true
console.log(dog.eats);  // true (inherited)`,
        diagram: `
graph TD
    D[dog] -->|__proto__| A[animal]
    A -->|__proto__| O[Object.prototype]
    O -->|__proto__| N[null]
        `,
      },
    ],
  },
  {
    id: "dom-browser",
    title: "DOM & Browser APIs",
    description: "Event Delegation, Storage, and Web APIs.",
    icon: "Zap",
    sections: [
      {
        id: "event-delegation",
        title: "Event Delegation",
        content: `
**Event Delegation** is a technique where you attach a single event listener to a parent element instead of multiple listeners to child elements.

### How it works:
It leverages **Event Bubbling**. When a child is clicked, the event bubbles up to the parent, where the listener catches it.

### Benefits:
1. **Memory Efficiency**: Fewer event listeners.
2. **Dynamic Elements**: Works for children added to the DOM later.
        `,
        code: `// Instead of adding listeners to every <li>
document.querySelector("#parent-list").addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    console.log("List item clicked:", e.target.innerText);
  }
});`,
        diagram: `
graph TD
    P[Parent Element] --> C1[Child 1]
    P --> C2[Child 2]
    P --> C3[Child 3]
    C2 -- "Click Event" --> C2
    C2 -- "Bubbles Up" --> P
    P -- "Listener Catches" --> H[Handler]
        `,
      },
      {
        id: "browser-storage",
        title: "Browser Storage",
        content: `
Modern browsers provide several ways to store data locally.

1. **LocalStorage**: Stores data with no expiration date. Persists even after the browser is closed. (5-10MB)
2. **SessionStorage**: Stores data for the duration of the page session. Cleared when the tab is closed. (5MB)
3. **Cookies**: Small pieces of data sent with every HTTP request. Used for auth and tracking. (4KB)
        `,
        code: `// LocalStorage
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme");

// SessionStorage
sessionStorage.setItem("sessionID", "12345");

// Cookies
document.cookie = "user=John; expires=Fri, 31 Dec 2024 23:59:59 GMT";`,
      },
      {
        id: "cors-intro",
        title: "CORS & Security",
        content: `
**CORS (Cross-Origin Resource Sharing)** is a critical browser security feature. It prevents malicious websites from making unauthorized requests to other domains.

For a deep dive into CORS, Preflight requests, and Web Application Firewalls, check out the dedicated **Web Security (CORS & WAF)** deck.
        `,
      },
    ],
  },
  {
    id: "async",
    title: "Asynchronous JavaScript",
    description: "The Event Loop, Microtasks, and Promises.",
    icon: "Zap",
    sections: [
      {
        id: "event-loop",
        title: "The Event Loop",
        content: `
The **Event Loop** is the mechanism that allows JS to perform non-blocking operations. It constantly monitors:
- **Call Stack**
- **Callback Queue** (Macrotask Queue)

**Algorithm**:
- If *Call Stack* is EMPTY, check *Callback Queue*.
- If *Callback Queue* has an item, push it to *Call Stack*.
        `,
        diagram: `
graph TD
    subgraph WebAPIs [Browser Web APIs]
        T[Timer]
        API[Fetch/XHR]
    end
    
    subgraph JSEngine [JS Engine]
        CS[Call Stack]
    end
    
    subgraph Queues
        MQ[Microtask Queue / Promises]
        CQ[Callback Queue / setTimeout]
    end
    
    T -- "Complete" --> CQ
    API -- "Resolve" --> MQ
    
    EL((Event Loop)) -- "Checks Prio" --> MQ
    EL -- "If MQ Empty" --> CQ
    EL -- "Push to" --> CS
        `,
        code: `console.log("Start");

setTimeout(function cbT() {
  console.log("CB Timeout");
}, 5000);

fetch("https://api.netflix.com")
  .then(function cbF() {
    console.log("CB Netflix");
  });

console.log("End");

/*
Browser handles Timer & Network.
cbT goes to Callback Queue.
cbF goes to Microtask Queue.

Priority: Microtask > Callback.
*/`,
      },
      {
        id: "microtasks",
        title: "Microtask Queue vs Callback Queue",
        content: `
**Microtask Queue** has higher priority than the **Callback Queue**.
- **Microtasks**: Promises (.then, .catch), MutationObserver.
- **Macrotasks (Callback Queue)**: setTimeout, setInterval, DOM Events.

The Event Loop will process ALL microtasks before even looking at the Callback Queue. This can lead to **Starvation** of the callback queue if microtasks create more microtasks recursively.
        `,
        code: `console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"))
                 .then(() => console.log("4"));

console.log("5");

// Output: 1, 5, 3, 4, 2`,
      },
      {
        id: "promises",
        title: "Promises",
        content: `
A **Promise** is an object representing the eventual completion or failure of an asynchronous operation.
It solves Inversion of Control (unlike callbacks).

**States**:
- Pending
- Fulfilled (resovled)
- Rejected
        `,
        code: `const cart = ["shoes", "pants", "kurta"];

createOrder(cart) // returns promise
  .then(function(orderId) {
    console.log(orderId);
    return proceedToPayment(orderId);
  })
  .then(function(paymentInfo) {
    console.log(paymentInfo);
  })
  .catch(function(err) {
    console.log(err.message);
  });`,
      },
      {
        id: "async-await",
        title: "Async & Await",
        content: `
**Async/Await** is syntactic sugar built on top of Promises. It makes asynchronous code look and behave more like synchronous code.

- **async**: Declares a function as asynchronous. It always returns a promise.
- **await**: Pauses the execution of the async function until the promise is settled. It can only be used inside an async function.

### Why use it?
1. **Readability**: Avoids "Promise Chaining" and "Callback Hell".
2. **Error Handling**: Use standard \`try/catch\` blocks.
3. **Debugging**: Stack traces are easier to read.
        `,
        code: `async function handleOrder() {
  try {
    const orderId = await createOrder(cart);
    const paymentInfo = await proceedToPayment(orderId);
    console.log(paymentInfo);
  } catch (err) {
    console.log(err.message);
  }
}

handleOrder();`,
        diagram: `
graph TD
    A[Start Async Function] --> B{Await Promise}
    B -- "Suspends Execution" --> C[Event Loop continues]
    D[Promise Settles] --> E[Resume Async Function]
    E --> F[Return Result]
        `,
      },
    ],
  },
  {
    id: "nodejs",
    title: "Node.js Masterclass",
    description:
      "Server-side JavaScript runtime, architecture, and advanced patterns.",
    icon: "Server",
    sections: [
      {
        id: "nodejs-architecture",
        title: "1. Architecture & Internals",
        content:
          "Node.js is a JavaScript runtime built on Chrome's **V8 JavaScript engine**. It uses an **event-driven, non-blocking I/O model** that makes it lightweight and efficient.\n\n### Key Components:\n\n1. **V8 Engine**: Converts JS code into machine code.\n2. **Libuv**: A C library that handles the Event Loop and asynchronous I/O (file system, DNS, network).\n3. **Event Loop**: The mechanism that allows Node.js to perform non-blocking I/O operations by offloading operations to the system kernel whenever possible.\n4. **Thread Pool**: Handled by Libuv for heavy tasks (like FS operations, crypto, compression) that can't be handled by the main thread.\n\nNode.js is **Single-Threaded** (the main event loop runs on a single thread), but it can offload tasks to the OS or thread pool, making it highly concurrent.",
        code: '// Check the current process architecture and versions\nconsole.log("Node Version:", process.version);\nconsole.log("V8 Version:", process.versions.v8);\nconsole.log("Platform:", process.platform);\nconsole.log("Architecture:", process.arch);\n\n// Simulating the event loop behavior\nconsole.log("1. Start");\nsetTimeout(() => console.log("2. Timeout callback"), 0);\nsetImmediate(() => console.log("3. Immediate callback"));\nprocess.nextTick(() => console.log("4. Next Tick"));\nconsole.log("5. End");\n// Output order: 1, 5, 4, 3, 2 (usually, though timers can vary)',
        diagram:
          "graph TD\n    subgraph System [Node.js System]\n        direction TB\n        subgraph Top [Upper Layer]\n            V8[V8 Engine]\n            API[Node API / Bindings]\n        end\n        subgraph Bottom [Lower Layer]\n            Libuv[Libuv Library]\n            EQ[Event Queue]\n            EL[Event Loop]\n            Libuv --- EQ\n            Libuv --- EL\n        end\n        Top --> Bottom\n    end\n    \n    JS[JavaScript Code] --> CS[Call Stack]\n    CS --> API\n    API --> EQ\n    EQ --> EL\n    EL -->|Callback| CS",
      },
      {
        id: "nodejs-modules",
        title: "2. Modules System",
        content:
          'Node.js has a module system to organize code.\n\n### CommonJS (CJS)\nThe default in Node.js. Uses `require()` to import and `module.exports` to export. It is **synchronous**.\n\n### ES Modules (ESM)\nThe modern standard. Uses `import` and `export`. It is **asynchronous** and static. To use ESM in Node, use `.mjs` extension or set `"type": "module"` in `package.json`.\n\n### Built-in Modules\n* **fs**: File system operations.\n* **path**: Handling file paths.\n* **os**: OS information.\n* **http**: Creating servers.\n* **events**: Event emitter.',
        code: "// --- math.js (CommonJS) ---\nconst add = (a, b) => a + b;\nmodule.exports = { add };\n\n// --- app.js ---\nconst { add } = require('./math');\nconst path = require('path');\n\nconsole.log(add(5, 3)); // 8\nconsole.log(path.join(__dirname, 'data', 'file.txt'));",
        diagram:
          'graph TD\n    subgraph CJS [CommonJS: Dynamic]\n        Start --> Check{If Condition}\n        Check -- True --> Req[require \'module\']\n        Check -- False --> Skip[Skip require]\n    end\n    \n    subgraph ESM [ESM: Static Graph]\n        Entry[Entry.js] --> DepA[Dep A]\n        Entry --> DepB[Dep B]\n        DepA --> DepC[Dep C]\n    end\n    \n    subgraph Wrapper [Module Wrapper]\n        Func["(function(exports, require, module, __filename, __dirname) {"]\n        Code["   // Your Code   "]\n        End["})"]\n        Func --- Code --- End\n    end',
      },
      {
        id: "nodejs-async",
        title: "3. Asynchronous Programming",
        content:
          "Handling operations that take time (I/O) without blocking the main thread.\n\n### Patterns:\n\n1. **Callbacks**: Functions passed as arguments to be executed later. Error-first pattern: `callback(err, data)`.\n2. **Promises**: Objects representing the eventual completion (or failure) of an async operation.\n3. **Async/Await**: Syntactic sugar over Promises for cleaner, synchronous-looking code.\n4. **Event Emitter**: The core of Node's async architecture. Many objects (Streams, HTTP request) emit events.",
        code: "const fs = require('fs').promises;\nconst EventEmitter = require('events');\nconst myEmitter = new EventEmitter();\n\n// Event Emitter\nmyEmitter.on('userLogged', (user) => {\n  console.log(`User ${user} logged in.`);\n});\n\n// Async/Await\nasync function readFile() {\n  try {\n    const data = await fs.readFile('./example.txt', 'utf-8');\n    console.log('File content:', data);\n    myEmitter.emit('userLogged', 'Alice');\n  } catch (err) {\n    console.error('Error:', err);\n  }\n}\n\nreadFile();",
        diagram:
          "graph TD\n    subgraph Loop [Event Loop Phases]\n        Timer[Timers] --> Pending[Pending Callbacks]\n        Pending --> Idle[Idle, Prepare]\n        Idle --> Poll[Poll I/O]\n        Poll --> Check[Check setImmediate]\n        Check --> Close[Close Callbacks]\n        Close --> Timer\n    end\n    \n    subgraph Priority [Queue Priority]\n        Micro[Microtasks: process.nextTick, Promises]\n        Macro[Macrotasks: setTimeout, I/O]\n        Micro -->|Executes Before| Macro\n    end",
      },
      {
        id: "nodejs-filesystem",
        title: "4. File System & Streams",
        content:
          "### File System (fs)\nRead/Write files. Always prefer **asynchronous** methods (e.g., `readFile`) over synchronous ones (`readFileSync`) in production to avoid blocking the Event Loop.\n\n### Buffers\nTemporary memory storage for raw binary data. Node.js can't handle binary data directly (strings are UTF-8), so it uses Buffers.\n\n### Streams\nHandling data piece-by-piece (chunks) rather than loading it all into memory.\n* **Readable**: Source of data (e.g., `fs.createReadStream`).\n* **Writable**: Destination (e.g., `fs.createWriteStream`, `res`).\n* **Duplex**: Both read and write (e.g., Sockets).\n* **Transform**: Modify data as it passes through (e.g., Gzip compression).",
        code: "const fs = require('fs');\nconst zlib = require('zlib');\n\n// Piping streams: Read -> Compress -> Write\n// This is memory efficient for large files\nfs.createReadStream('input.txt')\n  .pipe(zlib.createGzip())\n  .pipe(fs.createWriteStream('input.txt.gz'))\n  .on('finish', () => console.log('File compressed successfully'));",
        diagram:
          'graph LR\n    subgraph PipeDiagram [Pipe Analogy]\n        Tank[("Water Tank<br/>(Source)")] -- "Chunks" --> Pipe["== Pipe / Stream =="]\n        Pipe --> Bucket[("Bucket<br/>(Destination)")]\n    end\n    \n    subgraph BufferDiagram [Buffer Memory]\n        Mem["[ 00 ] [ A1 ] [ FF ] [ 0C ]"]\n        Desc["Fixed-size Memory Addresses"]\n        Mem --- Desc\n    end',
      },
      {
        id: "nodejs-networking",
        title: "5. Networking & Express",
        content:
          "Node.js is excellent for networking applications. The `http` module allows creating raw servers, but **Express.js** is the standard framework for simplifying this.\n\n### Concepts:\n* **Middleware**: Functions that execute during the request-response cycle. They can modify objects, end the cycle, or call the next middleware.\n* **Routing**: Defining how the app responds to client requests (URI + Method).\n* **REST API**: Representational State Transfer. Standard architectural style for APIs (GET, POST, PUT, DELETE).",
        code: "const express = require('express');\nconst app = express();\n\n// Middleware to parse JSON\napp.use(express.json());\n\n// Custom Middleware\napp.use((req, res, next) => {\n  console.log(`${req.method} request to ${req.url}`);\n  next();\n});\n\n// Route\napp.get('/api/users', (req, res) => {\n  res.json({ users: [{ id: 1, name: 'John' }] });\n});\n\napp.listen(3000, () => console.log('Server running on port 3000'));",
        diagram:
          "graph TD\n    Req[Request] --> M1[Middleware 1]\n    M1 -->|next| M2[Middleware 2]\n    M2 -->|next| Handler[Route Handler]\n    Handler -->|Response| M2\n    M2 -->|Response| M1\n    M1 -->|Response| Res[Client Response]",
      },
      {
        id: "nodejs-mvc",
        title: "6. MVC Architecture",
        content:
          "**Model-View-Controller (MVC)** is a design pattern that separates an application into three main logical components.\n\n### Components:\n\n- **Model**: Handles data logic and database interactions (e.g., Mongoose schemas).\n- **View**: The UI layer (e.g., EJS, React, or JSON for APIs).\n- **Controller**: The 'brain' that processes requests, interacts with models, and returns views.\n\n### Benefits:\n* **Separation of Concerns**: Each part has a specific job.\n* **Maintainability**: Easier to update and scale.\n* **Reusability**: Models can be used across different controllers.",
        code: "// --- 1. MODEL (models/userModel.js) ---\nconst mongoose = require('mongoose');\nconst userSchema = new mongoose.Schema({\n  name: String,\n  email: String\n});\nmodule.exports = mongoose.model('User', userSchema);\n\n// --- 2. CONTROLLER (controllers/userController.js) ---\nconst User = require('../models/userModel');\n\nexports.getAllUsers = async (req, res) => {\n  try {\n    const users = await User.find();\n    res.status(200).json(users);\n  } catch (err) {\n    res.status(500).json({ message: err.message });\n  }\n};\n\nexports.createUser = async (req, res) => {\n  const user = new User(req.body);\n  await user.save();\n  res.status(201).json(user);\n};\n\n// --- 3. ROUTES (routes/userRoutes.js) ---\nconst express = require('express');\nconst router = express.Router();\nconst userController = require('../controllers/userController');\n\nrouter.route('/')\n  .get(userController.getAllUsers)\n  .post(userController.createUser);\n\nmodule.exports = router;\n\n// --- 4. APP (app.js) ---\nconst express = require('express');\nconst app = express();\nconst userRouter = require('./routes/userRoutes');\n\napp.use(express.json());\napp.use('/api/users', userRouter);\n\napp.listen(3000, () => console.log('Server running...'));",
        diagram:
          "graph TD\n    User((User)) -->|Request| C[Controller]\n    C -->|Query| M[Model]\n    M -->|Data| C\n    C -->|Render/Send| V[View/Response]\n    V -->|Display| User",
      },
      {
        id: "nodejs-db",
        title: "6. Database Integration (MongoDB)",
        content:
          "Node.js works well with NoSQL databases like MongoDB due to the JSON-like structure of documents.\n\n### Mongoose\nAn Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and translates between objects in code and the representation of those objects in MongoDB.\n\n* **Schema**: Structure of the document.\n* **Model**: Constructor compiled from Schema to create/read documents.",
        code: "const mongoose = require('mongoose');\n\n// Connect\nmongoose.connect('mongodb://localhost:27017/myapp');\n\n// Define Schema\nconst UserSchema = new mongoose.Schema({\n  name: String,\n  email: { type: String, required: true }\n});\n\n// Create Model\nconst User = mongoose.model('User', UserSchema);\n\n// Create Document\nasync function createUser() {\n  const user = new User({ name: 'Jane', email: 'jane@example.com' });\n  await user.save();\n  console.log('User saved');\n}",
        diagram:
          'graph LR\n    Node["Node.js App"] <--> Mongoose["Mongoose ODM<br/>(Schemas)"]\n    Mongoose <--> Driver["MongoDB Driver"]\n    Driver <--> DB[("MongoDB Database")]\n    \n    Map["Maps JS Objects <-> BSON"] -.-> Mongoose',
      },
      {
        id: "nodejs-advanced",
        title: "7. Advanced Concepts",
        content: `
Scaling and optimizing Node.js applications.

### Child Processes vs Worker Threads
- **Child Processes**: Separate memory space, communication via IPC. Good for running external commands or heavy tasks that don't need shared memory.
- **Worker Threads**: Shared memory (using \`SharedArrayBuffer\`). Good for CPU-intensive JS tasks where data needs to be shared efficiently.

### Libuv Thread Pool
By default, Libuv uses a thread pool of **4 threads** (can be changed via \`UV_THREADPOOL_SIZE\`) to handle operations that are not natively asynchronous in the OS, such as:
- File system operations (\`fs\`)
- DNS lookups (\`dns.lookup\`)
- Crypto operations (\`crypto.pbkdf2\`, etc.)
- Compression (\`zlib\`)

### Clustering
Utilizes all CPU cores by spawning multiple instances of the Node.js process. The master process distributes incoming connections to workers using a Round-Robin algorithm.
        `,
        code: `const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  // This code runs in the main thread
  const worker = new Worker(__filename);
  worker.on('message', (msg) => console.log('From Worker:', msg));
  worker.postMessage('Start working!');
} else {
  // This code runs in the worker thread
  parentPort.on('message', (msg) => {
    console.log('From Main:', msg);
    parentPort.postMessage('Done!');
  });
}`,
        diagram: `
graph TD
    subgraph MainThread [Main Thread]
        EL[Event Loop]
        V8[V8 Engine]
    end
    
    subgraph LibuvPool [Libuv Thread Pool]
        T1[Thread 1]
        T2[Thread 2]
        T3[Thread 3]
        T4[Thread 4]
    end
    
    subgraph Workers [Worker Threads]
        W1[Worker 1]
        W2[Worker 2]
    end
    
    EL -->|Offload FS/Crypto| LibuvPool
    EL -->|CPU Intensive JS| Workers
        `,
      },
      {
        id: "nodejs-errors",
        title: "8. Error Handling",
        content:
          "Proper error handling is crucial for production Node.js apps to prevent crashes and provide meaningful feedback.\n\n### Best Practices:\n* **Try/Catch**: Use with async/await.\n* **Error Middleware**: In Express, use `(err, req, res, next)`.\n* **Uncaught Exceptions**: Listen to `process.on('uncaughtException')`.\n* **Custom Error Classes**: Extend the built-in `Error` class.",
        code: "// --- Custom Error ---\nclass AppError extends Error {\n  constructor(message, statusCode) {\n    super(message);\n    this.statusCode = statusCode;\n  }\n}\n\n// --- Express Error Middleware ---\napp.use((err, req, res, next) => {\n  res.status(err.statusCode || 500).json({\n    status: 'error',\n    message: err.message\n  });\n});",
      },
      {
        id: "nodejs-auth",
        title: "9. Authentication (JWT)",
        content:
          "**JSON Web Tokens (JWT)** are a compact, URL-safe means of representing claims to be transferred between two parties.\n\n### Flow:\n\n1. User logs in with credentials.\n2. Server validates and signs a JWT.\n3. Server sends JWT to client.\n4. Client sends JWT in `Authorization` header for subsequent requests.\n5. Server verifies JWT and grants access.",
        code: "const jwt = require('jsonwebtoken');\n\n// Sign Token\nconst token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {\n  expiresIn: '1d'\n});\n\n// Verify Token Middleware\nconst protect = (req, res, next) => {\n  const token = req.headers.authorization?.split(' ')[1];\n  if (!token) return res.status(401).send('Unauthorized');\n\n  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {\n    if (err) return res.status(401).send('Invalid Token');\n    req.user = decoded;\n    next();\n  });\n};",
        diagram:
          "graph TD\n    C[Client] -->|Request + JWT| S[Server]\n    S -->|Protected Data| C",
      },
      {
        id: "nodejs-config",
        title: "10. Environment & Validation",
        content:
          "Managing configuration and validating incoming data are essential for robust applications.\n\n### Environment Variables\nUse `dotenv` to load variables from a `.env` file into `process.env`. This keeps secrets (API keys, DB URIs) out of your source code.\n\n### Data Validation\nUse libraries like **Joi** or **Zod** to define schemas for incoming request data. This ensures your application only processes valid data and provides clear error messages to the client.",
        code: "// --- .env ---\n// PORT=3000\n// DATABASE_URL=mongodb://localhost/myapp\n\n// --- config.js ---\nrequire('dotenv').config();\nconst port = process.env.PORT || 3000;\n\n// --- Validation (Joi) ---\nconst Joi = require('joi');\nconst schema = Joi.object({\n  username: Joi.string().min(3).required(),\n  email: Joi.string().email().required()\n});\n\n// Middleware usage\nconst validateUser = (req, res, next) => {\n  const { error } = schema.validate(req.body);\n  if (error) return res.status(400).send(error.details[0].message);\n  next();\n};",
      },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Deployment",
    description:
      "Essential tools and practices for deploying and scaling modern applications.",
    icon: "Server",
    sections: [
      {
        id: "nginx-guide",
        title: "Nginx: The Swiss Army Knife of Web Servers",
        content: `
Nginx (pronounced "engine-x") is a high-performance web server, reverse proxy, and load balancer. It is known for its stability, rich feature set, simple configuration, and low resource consumption.

### Key Roles:
1. **Web Server**: Serving static content (HTML, CSS, JS, Images) extremely fast.
2. **Reverse Proxy**: Sitting in front of your application server (like Node.js) to handle requests, SSL termination, and caching.
3. **Load Balancer**: Distributing incoming traffic across multiple backend servers.

### Configuration Structure:
Nginx uses a hierarchical configuration system based on **contexts**:
- **Main**: Global settings (worker processes, user).
- **HTTP**: Settings for all HTTP/HTTPS traffic.
- **Server**: Defines a virtual host (domain/IP).
- **Location**: Defines how to handle specific URI patterns.
        `,
        code: `# --- Basic Reverse Proxy Configuration ---
server {
    listen 80;
    server_name example.com;

    # Serve static files
    location /static/ {
        root /var/www/app;
    }

    # Proxy requests to Node.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# --- Load Balancing ---
upstream myapp {
    server 10.0.0.1:3000;
    server 10.0.0.2:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://myapp;
    }
}`,
        diagram: `
graph LR
    Client((Client)) -->|HTTP/HTTPS| Nginx[Nginx Reverse Proxy]
    subgraph Backend [Backend Servers]
        S1[Node.js App 1]
        S2[Node.js App 2]
    end
    Nginx -->|Load Balance| S1
    Nginx -->|Load Balance| S2
        `,
      },
      {
        id: "docker-basics",
        title: "Docker & Containerization",
        content: `
Docker allows you to package an application with all of its dependencies into a standardized unit called a **container**.

### Why Docker?
- **Consistency**: "It works on my machine" is no longer an issue.
- **Isolation**: Each container runs in its own environment.
- **Portability**: Run the same container on any system that has Docker.

### Key Concepts:
- **Image**: A read-only template with instructions for creating a Docker container.
- **Container**: A runnable instance of an image.
- **Dockerfile**: A text document that contains all the commands a user could call on the command line to assemble an image.
- **Docker Compose**: A tool for defining and running multi-container Docker applications.
        `,
        code: `# --- Dockerfile for Node.js ---
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# --- docker-compose.yml ---
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
  db:
    image: mongo
    ports:
      - "27017:27017"`,
        diagram: `
graph TD
    DF[Dockerfile] -->|Build| Img[Docker Image]
    Img -->|Run| C1[Container 1]
    Img -->|Run| C2[Container 2]
    Img -->|Run| C3[Container 3]
        `,
      },
      {
        id: "docker-cli",
        title: "Docker CLI Reference",
        content: `
Essential commands for managing containers, images, volumes, and networks.

### Container Lifecycle
- **run**: Create and start a container (\`docker run -d --name app nginx\`).
- **start/stop/restart**: Manage container state.
- **rm**: Remove a container (\`docker rm -f app\`).
- **ps**: List containers (\`-a\` for all).

### Images
- **images**: List local images.
- **pull/push**: Download/Upload images from/to a registry.
- **build**: Build an image from a Dockerfile (\`docker build -t app:v1 .\`).
- **rmi**: Remove an image.

### Inspection & Execution
- **logs**: View container output (\`-f\` to follow).
- **exec**: Run commands in a running container (\`docker exec -it app sh\`).
- **inspect**: Detailed JSON info about a container/image.
- **stats**: Live resource usage.

### Volumes & Networks
- **volume create/ls**: Manage persistent data.
- **network create/ls**: Manage container communication.
        `,
        code: `# --- Common Workflow ---
# 1. Build an image
docker build -t my-node-app .

# 2. Run the container
docker run -d -p 3000:3000 --name my-app my-node-app

# 3. Check logs
docker logs -f my-app

# 4. Execute a command inside
docker exec -it my-app npm test

# 5. Cleanup
docker stop my-app && docker rm my-app`,
      },
      {
        id: "aws-ecs",
        title: "AWS Elastic Container Service (ECS)",
        content: `
AWS ECS is a fully managed container orchestration service that helps you run, stop, and manage Docker containers on a cluster.

### Key Components:
1. **Cluster**: A logical grouping of tasks or services.
2. **Task Definition**: A blueprint (JSON) that describes how a docker container should launch (CPU, memory, ports, images).
3. **Task**: A running instance of a Task Definition.
4. **Service**: Ensures that the specified number of tasks are constantly running and handles Load Balancer integration.

### Launch Types:
- **AWS Fargate**: Serverless. You don't manage servers; you just pay for the resources your containers use.
- **EC2 Launch Type**: You manage the underlying EC2 instances (servers) that run your containers.

### Deployment Workflow:
1. **Build & Tag**: Build your Docker image locally.
2. **Push to ECR**: Push the image to **AWS Elastic Container Registry (ECR)**.
3. **Create Task Definition**: Define the image URI, ports, and resource limits.
4. **Create Service**: Deploy the task definition to a cluster, optionally behind an **Application Load Balancer (ALB)**.
        `,
        code: `# --- AWS CLI Deployment Snippets ---

# 1. Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com

# 2. Tag your image
docker tag my-app:latest <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/my-app:latest

# 3. Push to ECR
docker push <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/my-app:latest

# 4. Update ECS Service (triggers new deployment)
aws ecs update-service --cluster my-cluster --service my-service --force-new-deployment`,
      },
      {
        id: "cicd-pipelines",
        title: "CI/CD & Automation",
        content: `
**Continuous Integration (CI)** and **Continuous Deployment (CD)** automate the process of software delivery.

### CI (Continuous Integration):
Developers frequently merge their code changes into a central repository, after which automated builds and tests are run.
- **Goal**: Find and fix bugs quicker, improve software quality.

### CD (Continuous Deployment/Delivery):
Automates the release of the validated code to a repository (Delivery) or directly to production (Deployment).
- **Goal**: Release new features to users as quickly as possible.

### Popular Tools:
- GitHub Actions
- Jenkins
- GitLab CI
- CircleCI
        `,
        code: `# --- GitHub Actions Workflow (.github/workflows/main.yml) ---
name: Node.js CI

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm install
    - run: npm test
    - name: Deploy to Server
      if: success()
      run: |
        echo "Deploying to production..."
        # Add deployment commands here`,
      },
      {
        id: "system-design-basics",
        title: "System Design Fundamentals",
        content: `
System design is the process of defining the architecture, components, and interfaces for a system to satisfy specified requirements.

### Key Concepts:
1. **Scalability**:
   - **Vertical**: Adding more power (CPU, RAM) to an existing server.
   - **Horizontal**: Adding more servers to the pool.
2. **Availability**: Ensuring the system is operational and accessible.
3. **Consistency**: Ensuring all nodes see the same data at the same time.
4. **Load Balancing**: Distributing traffic to prevent any single server from becoming a bottleneck.
5. **Caching**: Storing frequently accessed data in memory (e.g., Redis) to reduce latency.
        `,
        diagram: `
graph TD
    LB[Load Balancer] --> S1[Server 1]
    LB --> S2[Server 2]
    S1 --> DB[(Database)]
    S2 --> DB
    S1 --> Cache[(Redis Cache)]
    S2 --> Cache
        `,
      },
    ],
  },
];

export const interviewQuestions = [
  {
    id: 1,
    question: "What is the difference between null and undefined?",
    answer:
      "Undefined means a variable has been declared but not assigned a value. Null is an assignment value that represents no value.",
  },
  {
    id: 2,
    question: "Explain the Event Loop.",
    answer:
      "The Event Loop monitors the Call Stack and the Callback Queue. If the Call Stack is empty, it takes the first event from the queue and pushes it to the Call Stack.",
  },
  {
    id: 3,
    question: "What is 'this' keyword in JavaScript?",
    answer:
      "'this' refers to the object that is executing the current function. Its value depends on how the function is invoked (Method, Function, Constructor, Indirect).",
  },
  {
    id: 4,
    question: "What is Hoisting?",
    answer:
      "Hoisting is JS behavior where variable and function declarations are moved to the top of their scope before execution.",
  },
  {
    id: 5,
    question: "Difference between == and ===?",
    answer:
      "== checks value with type coercion. === checks both value and type without coercion.",
  },
  {
    id: 6,
    question: "What are Closures?",
    answer:
      "A closure is a function having access to the parent scope, even after the parent function has closed.",
  },
  {
    id: 7,
    question: "Explain Promise.all vs Promise.race vs Promise.allSettled.",
    answer:
      "Promise.all waits for all to fulfill (or first reject). Promise.race waits for first to settle. Promise.allSettled waits for all to settle regardless of outcome.",
  },
  {
    id: 8,
    question: "What is a Pure Function?",
    answer:
      "A function that always returns the same output for same input and has no side effects.",
  },
  {
    id: 9,
    question: "What is the specialized use of bind(), call(), and apply()?",
    answer:
      "They are used to explicitly set the value of 'this'. call/apply invoke immediately (apply takes array args), bind returns a new function.",
  },
  {
    id: 10,
    question: "What is debouncing and throttling?",
    answer:
      "Debouncing groups multiple calls into one after a pause. Throttling ensures function is called at most once in a specified period.",
  },
  {
    id: 11,
    question: "What is Event Bubbling and Capturing?",
    answer:
      "Bubbling: Event goes from target up to window. Capturing: Event goes from window down to target.",
  },
  {
    id: 12,
    question: "What is the Temporal Dead Zone?",
    answer:
      "The time between entering the scope and the actual declaration of a let/const variable, where accessing it throws ReferenceError.",
  },
  {
    id: 13,
    question: "What are Generator functions?",
    answer:
      "Functions that can be paused and resumed using the 'yield' keyword.",
  },
  {
    id: 14,
    question: "What is the prototype chain?",
    answer:
      "The mechanism by which objects inherit features. If a property is not on the object, JS looks up the prototype chain until null is reached.",
  },
  {
    id: 15,
    question: "Explain 'use strict'.",
    answer:
      "Enforces stricter parsing and error handling, prevents accidental globals, etc.",
  },
  {
    id: 16,
    question: "What is the difference between Map and WeakMap?",
    answer:
      "Map can have keys of any type and is iterable. WeakMap allows only objects as keys, is not iterable, and allows garbage collection of keys if there are no other references.",
  },
  {
    id: 17,
    question: "Deep Copy vs Shallow Copy?",
    answer:
      "Shallow copy copies the reference of nested objects. Deep copy creates a completely new independent copy of the object and its children.",
  },
  {
    id: 18,
    question: "What is typeof NaN?",
    answer:
      "'number'. NaN represents a value that is not a valid number, but the type is still Number.",
  },
  {
    id: 19,
    question: "Object.freeze() vs Object.seal()?",
    answer:
      "Freeze makes an object immutable (cannot add, delete, or modify properties). Seal prevents adding/deleting properties but allows modifying existing ones.",
  },
  {
    id: 20,
    question: "What is Currying?",
    answer:
      "The process of transforming a function taking multiple arguments into a sequence of functions each taking a single argument.",
  },
  {
    id: 21,
    question: "What is a Higher Order Function?",
    answer:
      "A function that takes another function as an argument or returns a function.",
  },
  {
    id: 22,
    question: "Difference between async and defer attributes in script tags?",
    answer:
      "Async downloads script in parallel and executes as soon as valid (blocking HTML). Defer downloads in parallel but executes only after HTML parsing is complete.",
  },
  {
    id: 23,
    question: "What is the purpose of the 'Symbol' type?",
    answer:
      "To create unique identifiers for object properties, often used to simulate private members or avoid name collisions.",
  },
  {
    id: 24,
    question: "What is Recursion?",
    answer:
      "A function properly calling itself to solve a problem by breaking it down into smaller sub-problems.",
  },
  {
    id: 25,
    question: "Explain the concept of 'Memoization'.",
    answer:
      "An optimization technique where the result of a function call is cached and returned when the same inputs are used again.",
  },
  {
    id: 26,
    question: "How does the 'this' keyword work in arrow functions?",
    answer:
      "Arrow functions do not have their own 'this'. They inherit 'this' from the parent scope (lexical scoping) at the time of definition.",
  },
  {
    id: 27,
    question:
      "What is the difference between Synchronous and Asynchronous programming?",
    answer:
      "Synchronous blocking architecture executes tasks sequentially. Asynchronous non-blocking architecture allows the program to continue executing other tasks while waiting for long-running operations to complete.",
  },
  {
    id: 28,
    question: "What is Prototypal Inheritance?",
    answer:
      "The ability of an object to access methods and properties from another object (its prototype). It is how inheritance is implemented in JavaScript.",
  },
  {
    id: 29,
    question: "Explain the concept of First-Class Functions.",
    answer:
      "Functions in JS are treated like variables. They can be assigned to variables, passed as arguments, and returned from other functions.",
  },
  {
    id: 30,
    question: "What is the purpose of the 'finally' block in promises?",
    answer:
      "The 'finally' block executes regardless of whether the promise was fulfilled or rejected, often used for cleanup operations.",
  },
  {
    id: 31,
    question: "What is Node.js and why is it single-threaded?",
    answer:
      "Node.js is a JS runtime built on V8. It is single-threaded to handle many concurrent connections without the overhead of thread management, using an event-driven, non-blocking I/O model.",
  },
  {
    id: 32,
    question: "What is the difference between setImmediate() and setTimeout()?",
    answer:
      "setImmediate() is designed to execute a script once the current poll phase completes. setTimeout() schedules a script to be run after a minimum threshold in ms has elapsed.",
  },
  {
    id: 33,
    question: "What is the purpose of module.exports?",
    answer:
      "It is used to export functions, objects, or variables from a module so they can be used in other files via require().",
  },
  {
    id: 34,
    question: "Explain the concept of Middleware in Express.",
    answer:
      "Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle.",
  },
  {
    id: 35,
    question: "What are Streams in Node.js?",
    answer:
      "Streams are collections of data that might not be available all at once and don't have to fit in memory. They are used to read or write data piece by piece.",
  },
  {
    id: 36,
    question:
      "What is the difference between process.nextTick() and setImmediate()?",
    answer:
      "process.nextTick() fires immediately after the current operation, before the event loop continues. setImmediate() fires in the next iteration of the event loop.",
  },
  {
    id: 37,
    question: "What is a Reverse Proxy?",
    answer:
      "A server that sits in front of web servers and forwards client requests to those web servers. It is used for load balancing, security, and performance.",
  },
  {
    id: 38,
    question:
      "What is the difference between a Container and a Virtual Machine?",
    answer:
      "VMs virtualize the hardware and include a full OS. Containers virtualize the OS kernel and share it with other containers, making them much lighter and faster.",
  },
  {
    id: 39,
    question: "What is Horizontal vs Vertical Scaling?",
    answer:
      "Vertical scaling means adding more resources (CPU/RAM) to a single server. Horizontal scaling means adding more servers to your infrastructure.",
  },
  {
    id: 40,
    question: "What is the purpose of a Load Balancer?",
    answer:
      "To distribute incoming network traffic across a group of backend servers to ensure no single server bears too much load, increasing reliability and availability.",
  },
];

export const todos = [
  "Add Service Workers & PWA deep dive",
  "Design Patterns (Singleton, Observer)",
  "Webpack & Bundling concepts",
  "React-specific core concepts (Virtual DOM)",
  "GraphQL vs REST comparison",
  "Microservices Architecture basics",
];
