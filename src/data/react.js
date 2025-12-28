export const topics = [
  {
    id: "introduction",
    title: "Introduction to React",
    description:
      "Understanding the core concepts of React, JSX, and the Virtual DOM.",
    icon: "Atom",
    sections: [
      {
        id: "what-is-react",
        title: "What is React?",
        content: `
React is a JavaScript library for building user interfaces, developed by Facebook. It allows developers to build complex UIs from small, isolated pieces of code called "components".

### Key Features:
1.  **Component-Based**: Build encapsulated components that manage their own state, then compose them to make complex UIs.
2.  **Declarative**: Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.
3.  **Virtual DOM**: React creates an in-memory data structure cache, computes the resulting differences, and then updates the browser's displayed DOM efficiently.
4.  **JSX**: A syntax extension for JavaScript that looks like HTML.

### Why React?
*   **Reusability**: Components can be reused across the application.
*   **Performance**: The Virtual DOM ensures minimal updates to the actual DOM.
*   **Ecosystem**: Huge community, rich ecosystem of libraries (Router, Redux, etc.).
        `,
        diagram: `
graph TD
    A[Real DOM] -- "Slow Updates" --> B(Browser)
    C[Virtual DOM] -- "Fast Diffing" --> D{React Engine}
    D -- "Batch Updates" --> A
    State[State Change] --> C
        `,
        code: {
          js: `import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return <h1>Hello, React!</h1>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
          ts: `import React from 'react';
import ReactDOM from 'react-dom/client';

function App(): JSX.Element {
  return <h1>Hello, React!</h1>;
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);`,
        },
      },
      {
        id: "jsx",
        title: "JSX (JavaScript XML)",
        content: `
JSX is a syntax extension for JavaScript. It allows you to write HTML-like code inside JavaScript.

### Rules of JSX:
1.  **Return a Single Root Element**: Wrap multiple elements in a parent tag or a Fragment (\`<>\`...\`</>\`).
2.  **Close All Tags**: Self-closing tags must end with \`/>\` (e.g., \`<img />\`).
3.  **camelCase**: Use camelCase for HTML attributes (e.g., \`className\` instead of \`class\`, \`onClick\` instead of \`onclick\`).
4.  **JavaScript Expressions**: Embed JS expressions inside curly braces \`{}\`.
        `,
        code: {
          js: `const name = "Developer";
const element = (
  <div className="greeting">
    <h1>Hello, {name}!</h1>
    <p>Welcome to React.</p>
  </div>
);`,
          ts: `const name: string = "Developer";
const element: JSX.Element = (
  <div className="greeting">
    <h1>Hello, {name}!</h1>
    <p>Welcome to React.</p>
  </div>
);`,
        },
      },
    ],
  },
  {
    id: "components-props",
    title: "Components & Props",
    description: "Building blocks of React applications and data passing.",
    icon: "Box",
    sections: [
      {
        id: "functional-components",
        title: "Functional Components",
        content: `
Functional components are just JavaScript functions that return JSX. They are the modern way to write React components.

### Props
Props (short for properties) are read-only inputs passed from a parent component to a child component. They allow you to make components dynamic and reusable.
        `,
        code: {
          js: `// Child Component
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}

// Parent Component
function App() {
  return (
    <div>
      <Welcome name="Alice" />
      <Welcome name="Bob" />
    </div>
  );
}`,
          ts: `// Child Component
interface WelcomeProps {
  name: string;
}

function Welcome({ name }: WelcomeProps): JSX.Element {
  return <h1>Hello, {name}</h1>;
}

// Parent Component
function App(): JSX.Element {
  return (
    <div>
      <Welcome name="Alice" />
      <Welcome name="Bob" />
    </div>
  );
}`,
        },
      },
    ],
  },
  {
    id: "state-lifecycle",
    title: "State & Lifecycle",
    description: "Managing data and side effects in components.",
    icon: "Activity",
    sections: [
      {
        id: "use-state",
        title: "useState Hook",
        content: `
\`useState\` is a Hook that lets you add React state to function components.

### Syntax
\`const [state, setState] = useState(initialValue);\`

*   \`state\`: The current state value.
*   \`setState\`: A function that updates the state.
*   \`initialValue\`: The initial value of the state.
        `,
        code: {
          js: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`,
          ts: `import React, { useState } from 'react';

function Counter(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`,
        },
      },
      {
        id: "use-effect",
        title: "useEffect Hook",
        content: `
\`useEffect\` lets you perform side effects in function components. It serves the same purpose as \`componentDidMount\`, \`componentDidUpdate\`, and \`componentWillUnmount\` in React classes.

### Common Side Effects:
*   Data fetching
*   Setting up a subscription
*   Manually changing the DOM

### Dependency Array:
*   \`[]\`: Runs only once (on mount).
*   \`[prop, state]\`: Runs on mount and when dependency changes.
*   No array: Runs on every render.
        `,
        code: {
          js: `import React, { useState, useEffect } from 'react';

function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    // Cleanup function (componentWillUnmount)
    return () => clearInterval(interval);
  }, []); // Empty array ensures this runs once

  return <h1>Seconds: {count}</h1>;
}`,
          ts: `import React, { useState, useEffect } from 'react';

function Timer(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    // Cleanup function
    return () => clearInterval(interval);
  }, []);

  return <h1>Seconds: {count}</h1>;
}`,
        },
      },
    ],
  },
  {
    id: "hooks-deep-dive",
    title: "Hooks Deep Dive",
    description: "Mastering built-in hooks for complex logic.",
    icon: "Anchor",
    sections: [
      {
        id: "use-context",
        title: "useContext",
        content: `
\`useContext\` provides a way to pass data through the component tree without having to pass props down manually at every level (prop drilling).

### Steps:
1.  Create Context: \`React.createContext()\`
2.  Provide Context: \`<MyContext.Provider value={...}>\`
3.  Consume Context: \`useContext(MyContext)\`
        `,
        diagram: `
graph TD
    A[App Component (Provider)] -- "Value: 'Dark'" --> B[Toolbar]
    B --> C[ThemedButton]
    C -- "useContext" --> D((Consumer))
    D -.-> A
        `,
        code: {
          js: `import React, { useContext, createContext, useState } from 'react';

const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return <ThemedButton />;
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>I am styled with {theme} theme</button>;
}`,
          ts: `import React, { useContext, createContext, useState } from 'react';

type Theme = 'light' | 'dark';
const ThemeContext = createContext<Theme>('light');

function App(): JSX.Element {
  const [theme, setTheme] = useState<Theme>('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(): JSX.Element {
  return <ThemedButton />;
}

function ThemedButton(): JSX.Element {
  const theme = useContext(ThemeContext);
  return <button className={theme}>I am styled with {theme} theme</button>;
}`,
        },
      },
      {
        id: "use-reducer",
        title: "useReducer",
        content: `
\`useReducer\` is usually preferable to \`useState\` when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one. It's similar to Redux.
        `,
        code: {
          js: `import React, { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}`,
          ts: `import React, { useReducer } from 'react';

interface State {
  count: number;
}

type Action = { type: 'increment' } | { type: 'decrement' };

const initialState: State = { count: 0 };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}`,
        },
      },
      {
        id: "use-ref",
        title: "useRef",
        content: `
\`useRef\` returns a mutable ref object whose \`.current\` property is initialized to the passed argument.

### Use Cases:
1.  **Accessing DOM elements**: Focus input, scroll to element.
2.  **Storing mutable values**: Values that persist across renders but **do not cause re-renders** when updated.
        `,
        code: {
          js: `import React, { useRef } from 'react';

function TextInputWithFocusButton() {
  const inputEl = useRef(null);

  const onButtonClick = () => {
    // \`current\` points to the mounted text input element
    inputEl.current.focus();
  };

  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}`,
          ts: `import React, { useRef } from 'react';

function TextInputWithFocusButton(): JSX.Element {
  const inputEl = useRef<HTMLInputElement>(null);

  const onButtonClick = () => {
    if (inputEl.current) {
      inputEl.current.focus();
    }
  };

  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}`,
        },
      },
    ],
  },
  {
    id: "performance",
    title: "Performance Optimization",
    description: "Techniques to make your React apps faster.",
    icon: "Zap",
    sections: [
      {
        id: "react-memo",
        title: "React.memo & useMemo",
        content: `
### React.memo
A higher-order component that memoizes the result. It skips rendering the component if the props haven't changed.

### useMemo
Returns a memoized value. It only recomputes the memoized value when one of the dependencies has changed. Use it for expensive calculations.
        `,
        code: {
          js: `import React, { useState, useMemo } from 'react';

function ExpensiveComponent({ num }) {
  const computed = useMemo(() => {
    console.log("Calculating...");
    return num * 2; // Imagine a heavy computation here
  }, [num]);

  return <div>Result: {computed}</div>;
}

const MemoizedComponent = React.memo(ExpensiveComponent);`,
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
}

const MemoizedComponent = React.memo(ExpensiveComponent);`,
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
    id: "advanced-patterns",
    title: "Advanced Patterns",
    description: "Design patterns for scalable React applications.",
    icon: "Layers",
    sections: [
      {
        id: "custom-hooks",
        title: "Custom Hooks",
        content: `
Custom Hooks let you extract component logic into reusable functions. They must start with "use".
        `,
        code: {
          js: `import { useState, useEffect } from 'react';

// Custom Hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
}

// Usage
function App() {
  const { data, loading } = useFetch('https://api.example.com/data');
  if (loading) return <p>Loading...</p>;
  return <div>{JSON.stringify(data)}</div>;
}`,
          ts: `import { useState, useEffect } from 'react';

// Custom Hook
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
}

// Usage
interface UserData {
  id: number;
  name: string;
}

function App(): JSX.Element {
  const { data, loading } = useFetch<UserData>('https://api.example.com/data');
  if (loading) return <p>Loading...</p>;
  return <div>{data?.name}</div>;
}`,
        },
      },
    ],
  },
];
