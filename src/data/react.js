export const topics = [
  {
    id: "introduction",
    title: "Introduction to React",
    description: "Understanding the core concepts: What, Why, and How?",
    icon: "Atom",
    sections: [
      {
        id: "what-is-react",
        title: "What is React?",
        content: `
React is a JavaScript library for building user interfaces (UIs). Think of it as a tool that helps you build complex websites like using LEGO blocks. Instead of building the whole thing in one piece, you build small, reusable blocks called **Components** and put them together.

### The "Blueprint" Analogy (Virtual DOM)
Imagine you are an architect.
1.  **Real DOM**: This is the actual house. Changing a wall in the real house is slow and expensive.
2.  **Virtual DOM**: This is your digital blueprint. You can make 1,000 changes to the blueprint in milliseconds.
3.  **React's Job**: When you change the blueprint (state), React compares the new blueprint with the old one, finds exactly what changed (e.g., just one window), and efficiently updates *only that part* of the real house.

### Key Features
*   **Component-Based**: Build small, independent pieces (Header, Footer, Button) and combine them.
*   **Declarative**: You tell React *what* the UI should look like for a given state, and React handles the *how* (the easy updates).
`,
        diagram: `
graph TD
    State[State Changes] --> Blueprint[Update Virtual DOM]
    Blueprint -- "Compare (Diffing)" --> Changes{What changed?}
    Changes -- "Only update changed parts" --> RealDOM[Update Browser DOM]
        `,
        code: {
          js: `import React from 'react';
import ReactDOM from 'react-dom/client';

// This is a Component (A Lego Block)
function HelloWorld() {
  return <h1>Hello, React!</h1>;
}

// We place the block into the 'root' of our HTML
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<HelloWorld />);`,
          ts: `import React from 'react';
import ReactDOM from 'react-dom/client';

// This is a Component
function HelloWorld(): JSX.Element {
  return <h1>Hello, React!</h1>;
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<HelloWorld />);`,
        },
      },
      {
        id: "jsx",
        title: "JSX: Writing HTML in JavaScript",
        content: `
JSX stands for JavaScript XML. It looks like HTML, but it's actually JavaScript syntax sugar. It makes writing UIs easier because you can see the structure of the UI alongside the logic.

### 4 Golden Rules of JSX
1.  **Single Parent**: You must return one wrapping element. Use a \`<div>\` or a Fragment \`<>\`...\`</>\`.
2.  **Close All Tags**: HTML allows \`<br>\`, but JSX requires \`<br />\`.
3.  **CamelCase**: \`class\` becomes \`className\`, \`onclick\` becomes \`onClick\`, \`tabindex\` becomes \`tabIndex\`.
4.  **JavaSciprt Power**: Anything inside \`{}\` is treated as JavaScript code. Variables, functions, math—it all works!
`,
        code: {
          js: `const user = {
  firstName: "Jane",
  lastName: "Doe",
  avatar: "https://example.com/jane.jpg"
};

// You can use JS variables inside JSX curly braces
const element = (
  <div className="user-card">
    <img src={user.avatar} alt="User Avatar" />
    <h2>{user.firstName} {user.lastName}</h2>
    <p>Rank: {10 + 20}</p> 
  </div>
);`,
          ts: `interface User {
  firstName: string;
  lastName: string;
  avatar: string;
}

const user: User = {
  firstName: "Jane",
  lastName: "Doe",
  avatar: "https://example.com/jane.jpg"
};

const element: JSX.Element = (
  <div className="user-card">
    <img src={user.avatar} alt="User Avatar" />
    <h2>{user.firstName} {user.lastName}</h2>
    <p>Rank: {10 + 20}</p>
  </div>
);`,
        },
      },
      {
        id: "react-fragments",
        title: "Fragments",
        content: `
Sometimes you want to return multiple elements but don't want to add an extra \`<div>\` to the DOM (which can break CSS layouts like Flexbox or Grid). Use **Fragments**!

**Syntax:** \`<React.Fragment>...</React.Fragment>\` or the short syntax \`<>\`...\`</>\`
`,
        code: {
          js: `// Wrong:
// return (
//   <h1>Title</h1>
//   <p>Text</p>
// )

// Correct (using Fragment):
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);`,
        },
      },
    ],
  },
  {
    id: "components-props",
    title: "Components & Props",
    description: "Building blocks and passing data between them.",
    icon: "Box",
    sections: [
      {
        id: "functional-components",
        title: "Functional Components",
        content: `
A Functional Component is simply a JavaScript function that returns UI (JSX). 

### Why Components?
*   **Reusability**: Write a <Button /> once, use it everywhere.
*   **Organization**: Keep your code clean by separating concerns.
`,
        code: {
          js: `// 1. Define the component
function Greeting() {
  return <p>Welcome to my website!</p>;
}

// 2. Use the component
function App() {
  return (
    <div>
      <h1>Home Page</h1>
      <Greeting />
      <Greeting />
    </div>
  );
}`,
        },
      },
      {
        id: "props",
        title: "Props (Properties)",
        content: `
**Props** are like arguments to a function. They let you pass data from a **Parent** component down to a **Child** component.

### The "DNA" Analogy
Props are like your DNA. You received them from your parents, and you **cannot change them** yourself (they are read-only). If a component needs to change something, it needs "State", not props.
`,
        code: {
          js: `// Child accepts props
// We use destructuring { name, role } to make it cleaner
function UserProfile({ name, role }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>Role: {role}</p>
    </div>
  );
}

// Parent passes props
function App() {
  return (
    <div>
      <UserProfile name="Alice" role="Admin" />
      <UserProfile name="Bob" role="Editor" />
    </div>
  );
}`,
          ts: `// Define the shape of the props
interface UserProfileProps {
  name: string;
  role: string;
}

function UserProfile({ name, role }: UserProfileProps): JSX.Element {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>Role: {role}</p>
    </div>
  );
}

function App(): JSX.Element {
  return (
    <div>
      <UserProfile name="Alice" role="Admin" />
      <UserProfile name="Bob" role="Editor" />
    </div>
  );
}`,
        },
      },
      {
        id: "children-prop",
        title: "The 'children' Prop",
        content: `
Sometimes you want a component to contain *anything* inside it, like a box or a layout. React provides a special prop called \`children\` for this.
`,
        code: {
          js: `function Card({ children }) {
  return <div className="fancy-border">{children}</div>;
}

function App() {
  return (
    <Card>
      {/* Everything inside here is passed as 'children' */}
      <h1>Title</h1>
      <p>This is content inside the card.</p>
    </Card>
  );
}`,
        },
      },
    ],
  },
  {
    id: "rendering-lists",
    title: "Logic: Conditions & Lists",
    description: "Handling logic, loops, and conditional displays.",
    icon: "List",
    sections: [
      {
        id: "conditional-rendering",
        title: "Conditional Rendering",
        content: `
In React, we don't have block-level \`if-else\` inside JSX. Instead, we use JavaScript operators.

### Common Patterns:
1.  **Ternary Operator (condition ? true : false)**: Good for "This OR That".
2.  **Logical AND (condition && result)**: Good for "Show this IF true".
`,
        code: {
          js: `function UserDashboard({ isLoggedIn, hasNotifications }) {
  return (
    <div>
      {/* Ternary: Show Welcome OR Login */}
      {isLoggedIn ? (
        <h1>Welcome Back!</h1>
      ) : (
        <button>Login</button>
      )}

      {/* Logical AND: Show bell IF notifications exist */}
      {hasNotifications && <span>🔔 You have new messages!</span>}
    </div>
  );
}`,
        },
      },
      {
        id: "lists-keys",
        title: "Rendering Lists & Keys",
        content: `
To display a list of items, we use the JavaScript \`.map()\` method. 

### Why do we need Keys?
React needs a unique ID (key) for each item in a list to track it efficiently. If you delete item #2, React uses the key to know exactly which DOM element to remove without rebuilding the whole list.

**Pitfall**: Avoid using the array \`index\` as a key if the list can change (sort, filter, delete).
`,
        code: {
          js: `const products = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Mouse', price: 25 },
  { id: 3, name: 'Keyboard', price: 75 }
];

function ProductList() {
  return (
    <ul>
      {products.map((product) => (
        // KEY IS REQUIRED HERE
        <li key={product.id}>
          {product.name} - \${product.price}
        </li>
      ))}
    </ul>
  );
}`,
        },
      },
    ],
  },
  {
    id: "state-interactive",
    title: "Interactivity: State & Events",
    description: "Making your app respond to user inputs.",
    icon: "Activity",
    sections: [
      {
        id: "handling-events",
        title: "Handling Events",
        content: `
React events look like standard HTML events but use camelCase (\`onClick\`, \`onSubmit\`). You pass a **function** to the event handler, not a string.
`,
        code: {
          js: `function Clicker() {
  // Define the function
  const handleClick = () => {
    alert("Button Clicked!");
  };

  return (
    // Pass the function (don't call it like handleClick())
    <button onClick={handleClick}>Click Me</button>
  );
}

// Passing arguments
function Deleter({ id }) {
  return <button onClick={() => deleteItem(id)}>Delete</button>;
}`,
        },
      },
      {
        id: "use-state",
        title: "useState Hook",
        content: `
**State** is the memory of a component. Unlike props, state **can change**.

### The "Mood" Analogy
State is like a person's mood. It changes over time based on what happens (events). When your mood changes, your facial expression (the UI) updates automatically.

### Syntax
\`const [currentValue, setValue] = useState(initialValue);\`
`,
        code: {
          js: `import { useState } from 'react';

function Counter() {
  // 1. Declare state variable 'count' initialized to 0
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      
      {/* 2. Update state on click */}
      <button onClick={() => setCount(count + 1)}>Increment</button>
      
      {/* Update based on previous value (Safer) */}
      <button onClick={() => setCount(prev => prev - 1)}>Decrement</button>
    </div>
  );
}`,
        },
      },
      {
        id: "forms",
        title: "Forms & Controlled Components",
        content: `
In HTML, inputs manage their own state. In React, we prefer **Controlled Components**, where the React state controls what is displayed in the input.

1.  **Value**: Linked to a state variable.
2.  **OnChange**: Updates the state variable as you type.
`,
        code: {
          js: `function SignupForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent full page reload
    alert("Signed up with: " + email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Email:</label>
      <input 
        type="email" 
        value={email} // Controlled by React
        onChange={(e) => setEmail(e.target.value)} // Updates React
      />
      <button type="submit">Submit</button>
    </form>
  );
}`,
        },
      },
      {
        id: "lifting-state-up",
        title: "Lifting State Up",
        content:
          "When two components need to share data, move the state up to their closest common parent.",
        diagram: `
graph TD
    Parent[Parent Component] -- "Passes State as Prop" --> ChildA[Child A (Display)]
    Parent -- "Passes Setter as Prop" --> ChildB[Child B (Button)]
    ChildB -.->|Calls Setter| Parent
        `,
        code: {
          js: `function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Display count={count} />
      <Button onIncrement={() => setCount(count + 1)} />
    </div>
  );
}

function Display({ count }) {
  return <h1>Count: {count}</h1>;
}

function Button({ onIncrement }) {
  return <button onClick={onIncrement}>Add</button>;
}`,
        },
      },
    ],
  },
  {
    id: "effects-lifecycle",
    title: "Effects & Lifecycle",
    description: "Synchronizing with the outside world.",
    icon: "RefreshCw",
    sections: [
      {
        id: "use-effect",
        title: "useEffect Hook",
        content: `
\`useEffect\` is for **Side Effects**. A side effect is anything that affects something outside the scope of the function return (e.g., fetching data, changing the document title, setting a timer).

### The "Dependency Array" Rules
*   \`useEffect(fn)\` (No array): Runs **every render** (Dangerous!).
*   \`useEffect(fn, [])\` (Empty array): Runs **only once** on mount (like "Page Load").
*   \`useEffect(fn, [prop])\`: Runs on mount **AND** whenever \`prop\` changes.
`,
        code: {
          js: `import { useState, useEffect } from 'react';

function UserData({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Logic to run (Fetch data)
    console.log("Fetching data for user...", userId);
    
    // Imagine a fetch API call here
    // fetch('/api/user/' + userId).then(...)

    // 2. Cleanup Function (Optional)
    return () => {
      console.log("Cleanup! Component unmounted or userId changed.");
    };
  }, [userId]); // Run whenever 'userId' changes

  return <div>Data loaded for user {userId}</div>;
}`,
        },
      },
      {
        id: "use-effect-timer",
        title: "Example: Timer with Cleanup",
        content: `
A classic use case for \`useEffect\` is setting up a timer (Interval). We **must** clean it up when the component is removed, otherwise the timer keeps running forever!
`,
        code: {
          js: `import React, { useState, useEffect } from 'react';

function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Start the timer
    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    // Stop the timer when component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array = run once on mount

  return <h1>Seconds: {count}</h1>;
}`,
        },
      },
    ],
  },
  {
    id: "hooks-deep-dive",
    title: "Advanced Hooks",
    description: "Managing complex logic and context.",
    icon: "Anchor",
    sections: [
      {
        id: "use-context",
        title: "useContext: Preventing Prop Drilling",
        content: `
Sometimes you have global data (like User Login, Theme, Language) that many components need. passing props down 10 levels ("Prop Drilling") is messy. **Context** lets you teleport data to any component in the tree.

**Steps:**
1.  **Create**: \`createContext()\`
2.  **Provide**: Wrap app in \`<Context.Provider>\`
3.  **Consume**: Use \`useContext()\` anywhere inside.
`,
        code: {
          js: `import { createContext, useContext, useState } from 'react';

// 1. Create Context
const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("light");
  
  return (
    // 2. Provide content
    <ThemeContext.Provider value={theme}>
      <Toolbar />
      <button onClick={() => setTheme("dark")}>Switch to Dark</button>
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  // Toolbar doesn't need props! It just holds the button.
  return <ThemedButton />;
}

function ThemedButton() {
  // 3. Consume context
  const theme = useContext(ThemeContext);
  return <button className={theme}>I am {theme}!</button>;
}`,
        },
      },
      {
        id: "use-ref",
        title: "useRef: Memory without Renders",
        content: `
\`useRef\` is like a standard variable that "survives" renders but **doesn't trigger** a re-render when changed.

**Common Uses:**
1.  Accessing DOM elements directly (e.g., strictly to give focus).
2.  Storing values like timer IDs.
`,
        code: {
          js: `import { useRef } from 'react';

function FocusInput() {
  const inputRef = useRef(null);

  const focusBox = () => {
    // Directly access the DOM node
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusBox}>Focus Input</button>
    </>
  );
}`,
        },
      },
      {
        id: "use-reducer",
        title: "useReducer: Complex State",
        content: `
When you have complex state logic (like an object with many fields, or multiple dependent states), \`useReducer\` is cleaner than many \`useState\`s. It works like the Redux pattern: you send an "Action" to a "Reducer" function to get the new state.
        `,
        code: {
          js: `import { useReducer } from 'react';

// The logic lives outside the component
function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}`,
        },
      },
    ],
  },
  {
    id: "optimization",
    title: "Optimization",
    description: "Making React fast.",
    icon: "Zap",
    sections: [
      {
        id: "memo",
        title: "React.memo",
        content: `
By default, when a Parent renders, **all** its children re-render, even if their props didn't change!
\`React.memo\` wraps a component and tells it: "Only re-render if your Props actually changed."
`,
        code: {
          js: `const Child = React.memo(({ name }) => {
  console.log("Child render");
  return <div>{name}</div>;
});

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <>
      <button onClick={() => setCount(c => c+1)}>Count: {count}</button>
      {/* Child won't re-render because 'name' prop is still "Alice" */}
      <Child name="Alice" />
    </>
  );
}`,
        },
      },
      {
        id: "use-memo",
        title: "useMemo",
        content: `
Returns a memoized value. It only recomputes the memoized value when one of the dependencies has changed. Use it for expensive calculations to avoid re-running them on every render.
        `,
        code: {
          js: `import React, { useState, useMemo } from 'react';

function ExpensiveComponent({ num }) {
  const computed = useMemo(() => {
    console.log("Calculating...");
    return num * 2; // Imagine a heavy computation here
  }, [num]);

  return <div>Result: {computed}</div>;
}`,
          ts: `import React, { useState, useMemo } from 'react';

interface Props {
  num: number;
}

function ExpensiveComponent({ num }: Props): JSX.Element {
  const computed = useMemo(() => {
    console.log("Calculating...");
    return num * 2;
  }, [num]);

  return <div>Result: {computed}</div>;
}`,
        },
      },
      {
        id: "use-callback",
        title: "useCallback",
        content: `
Returns a memoized callback. It's useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders (like those wrapped in \`React.memo\`).
        `,
        code: {
          js: `import React, { useState, useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // Function reference stays the same across renders

  return <Child onClick={handleClick} />;
}

const Child = React.memo(({ onClick }) => {
  console.log("Child Rendered");
  return <button onClick={onClick}>Click me</button>;
});`,
          ts: `import React, { useState, useCallback } from 'react';

function Parent(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return <Child onClick={handleClick} />;
}

interface ChildProps {
  onClick: () => void;
}

const Child = React.memo(({ onClick }: ChildProps) => {
  console.log("Child Rendered");
  return <button onClick={onClick}>Click me</button>;
});`,
        },
      },
    ],
  },
  {
    id: "custom-hooks",
    title: "Custom Hooks",
    description: "Reusing logic across components.",
    icon: "Layers",
    sections: [
      {
        id: "creating-custom-hook",
        title: "Building a Custom Hook",
        content: `
If you find yourself writing the same \`useEffect\` or state logic in multiple components, extract it into a Custom Hook. A custom hook is just a function that starts with \`use\` and calls other hooks.
`,
        code: {
          js: `// useWindowSize.js
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [size, setSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// App.js
function App() {
  const width = useWindowSize();
  return <h1>Window width: {width}px</h1>;
}`,
        },
      },
    ],
  },
  {
    id: "ecosystem",
    title: "React Ecosystem",
    description: "Tools usually used with React.",
    icon: "Globe",
    sections: [
      {
        id: "router",
        title: "Routing (React Router)",
        content:
          "React is a Single Page Application (SPA). To handle page limits, we use **React Router**.",
        code: {
          js: `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}`,
        },
      },
      {
        id: "styling",
        title: "Styling React",
        content: "There are many ways to style React apps.",
        code: {
          js: `// 1. CSS Modules
import styles from './Button.module.css';
<button className={styles.btn}>Click</button>

// 2. Styled Components (Library)
const Button = styled.button\`
  background: blue;
  color: white;
\`;

// 3. Tailwind CSS (Utility classes)
<button className="bg-blue-500 text-white px-4 py-2">Click</button>`,
        },
      },
    ],
  },
];
