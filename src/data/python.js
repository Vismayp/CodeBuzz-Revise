export const topics = [
  {
    id: "basics",
    title: "Python Basics",
    description:
      "Fundamental concepts of Python programming including variables, types, and control flow.",
    icon: "BookOpen",
    sections: [
      {
        id: "variables-datatypes",
        title: "Variables & Data Types",
        content:
          "Python is dynamically typed. Variables do not need explicit declaration. Common types include int, float, str, bool, and None.",
        code: `x = 10          # int
y = 3.14        # float
name = "Python" # str
is_active = True # bool
nothing = None  # NoneType

# Type checking
print(type(x))  # <class 'int'>

# String interpolation (f-strings)
print(f"Hello, {name}!")`,
        diagram: `graph TD
    A[Variable Name] -->|Reference| B(Value Object)
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#ccf,stroke:#333,stroke-width:2px`,
      },
      {
        id: "control-flow",
        title: "Control Flow",
        content:
          "Python uses indentation for blocks. `if`, `elif`, and `else` control execution flow.",
        code: `age = 20

if age < 13:
    print("Child")
elif age < 20:
    print("Teenager")
else:
    print("Adult")

# Ternary Operator
status = "Adult" if age >= 18 else "Minor"`,
      },
      {
        id: "loops",
        title: "Loops",
        content:
          "`for` loops iterate over sequences. `while` loops run as long as a condition is true.",
        code: `# For loop
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Range
for i in range(5): # 0 to 4
    print(i)

# While loop
count = 0
while count < 3:
    print(count)
    count += 1`,
      },
    ],
  },
  {
    id: "data-structures",
    title: "Data Structures",
    description: "In-depth look at Lists, Tuples, Sets, and Dictionaries.",
    icon: "Database",
    sections: [
      {
        id: "lists",
        title: "Lists",
        content:
          "Ordered, mutable collections. Support slicing and various methods.",
        code: `nums = [1, 2, 3, 4, 5]

# Slicing [start:end:step]
print(nums[1:4])  # [2, 3, 4]
print(nums[::-1]) # [5, 4, 3, 2, 1] (Reverse)

# Methods
nums.append(6)
nums.extend([7, 8])
last = nums.pop()
nums.insert(0, 0)

# List Comprehension
squares = [x**2 for x in nums if x % 2 == 0]`,
      },
      {
        id: "dictionaries",
        title: "Dictionaries",
        content: "Key-Value pairs. Keys must be immutable (hashable).",
        code: `user = {"name": "Alice", "age": 30}

# Access
print(user["name"])
print(user.get("email", "Not Found")) # Safe access

# Iteration
for key, value in user.items():
    print(f"{key}: {value}")

# Dictionary Comprehension
squared_dict = {x: x**2 for x in range(5)}`,
      },
      {
        id: "sets-tuples",
        title: "Sets & Tuples",
        content:
          "**Sets**: Unordered, unique elements. **Tuples**: Ordered, immutable sequences.",
        code: `# Sets
s1 = {1, 2, 3}
s2 = {3, 4, 5}
print(s1.union(s2))        # {1, 2, 3, 4, 5}
print(s1.intersection(s2)) # {3}

# Tuples
point = (10, 20)
# point[0] = 15  # TypeError: 'tuple' object does not support item assignment

x, y = point # Unpacking`,
      },
    ],
  },
  {
    id: "functions",
    title: "Functions & Functional Programming",
    description: "Advanced function concepts, decorators, and generators.",
    icon: "FunctionSquare",
    sections: [
      {
        id: "args-kwargs",
        title: "*args and **kwargs",
        content:
          "Allow functions to accept arbitrary numbers of positional and keyword arguments.",
        code: `def flexible_func(*args, **kwargs):
    print(f"Positional: {args}")
    print(f"Keyword: {kwargs}")

flexible_func(1, 2, 3, a="apple", b="banana")
# Output:
# Positional: (1, 2, 3)
# Keyword: {'a': 'apple', 'b': 'banana'}`,
      },
      {
        id: "decorators",
        title: "Decorators",
        content:
          "Functions that modify the behavior of other functions. Syntactic sugar `@decorator`.",
        code: `def log_execution(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        result = func(*args, **kwargs)
        print(f"Finished {func.__name__}")
        return result
    return wrapper

@log_execution
def add(a, b):
    return a + b

add(5, 3)`,
      },
      {
        id: "generators",
        title: "Generators",
        content:
          "Functions that return an iterator using `yield`. Memory efficient for large sequences.",
        code: `def countdown(n):
    while n > 0:
        yield n
        n -= 1

for num in countdown(3):
    print(num)

# Generator Expression
gen = (x**2 for x in range(1000000)) # Doesn't compute all at once`,
      },
      {
        id: "map-filter-reduce",
        title: "Map, Filter, Reduce",
        content: "Functional programming tools.",
        code: `from functools import reduce

nums = [1, 2, 3, 4]

# Map
doubled = list(map(lambda x: x * 2, nums))

# Filter
evens = list(filter(lambda x: x % 2 == 0, nums))

# Reduce
sum_all = reduce(lambda x, y: x + y, nums)`,
      },
    ],
  },
  {
    id: "oop",
    title: "Object-Oriented Programming",
    description: "Classes, Inheritance, Polymorphism, and Magic Methods.",
    icon: "Box",
    sections: [
      {
        id: "classes-objects",
        title: "Classes & Objects",
        content: `
Think of a **Class** as a **blueprint**, and an **Object** as a **thing created from that blueprint**.

### Real-life analogy:
| Real World | Python |
|-----------|--------|
| Blueprint of a Car | Class |
| A specific car (red BMW) | Object |
| Properties (color, model) | Attributes |
| Behaviors (drive, stop) | Methods |
        `,
        code: `class Car:
    def __init__(self, brand, color):
        self.brand = brand  # Attribute
        self.color = color

    def drive(self):
        return f"{self.brand} is driving!"

# Creating Objects
car1 = Car("BMW", "Red")
car2 = Car("Tesla", "White")

print(car1.drive()) # BMW is driving!`,
      },
      {
        id: "class-vs-instance",
        title: "Class vs Instance Attributes",
        content: `
- **Instance Attribute**: Belongs to each object separately (defined in \`__init__\`).
- **Class Attribute**: Shared by all objects of the class.
        `,
        code: `class Dog:
    species = "Canine"  # Class attribute

    def __init__(self, name):
        self.name = name  # Instance attribute

dog1 = Dog("Buddy")
dog2 = Dog("Max")

print(dog1.species) # Canine
print(dog2.species) # Canine`,
      },
      {
        id: "classes-inheritance",
        title: "Inheritance",
        content: "Defining blueprints for objects and inheriting behavior.",
        code: `class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"

pets = [Dog("Buddy"), Cat("Whiskers")]
for pet in pets:
    print(f"{pet.name}: {pet.speak()}")`,
        diagram: `classDiagram
    class Animal {
        +String name
        +speak()
    }
    class Dog {
        +speak()
    }
    class Cat {
        +speak()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
      },
      {
        id: "dunder-methods",
        title: "Dunder (Magic) Methods",
        content:
          "Special methods starting and ending with double underscores to emulate built-in behavior.",
        code: `class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Vector({self.x}, {self.y})"

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

v1 = Vector(1, 2)
v2 = Vector(3, 4)
print(v1 + v2) # Output: Vector(4, 6)`,
      },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Python",
    description: "Context Managers, Metaclasses, and Concurrency.",
    icon: "Cpu",
    sections: [
      {
        id: "context-managers",
        title: "Context Managers",
        content:
          "Manage resources using the `with` statement. Implements `__enter__` and `__exit__`.",
        code: `with open("file.txt", "w") as f:
    f.write("Hello")
# File is automatically closed here

# Custom Context Manager
class Timer:
    def __enter__(self):
        import time
        self.start = time.time()
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        import time
        print(f"Elapsed: {time.time() - self.start}s")

with Timer():
    sum(range(1000000))`,
      },
      {
        id: "concurrency",
        title: "Concurrency: Threading vs Asyncio",
        content:
          "**Threading**: Good for I/O bound tasks. **Asyncio**: Single-threaded cooperative multitasking.",
        code: `import asyncio

async def fetch_data():
    print("Start fetching")
    await asyncio.sleep(1) # Simulate I/O
    print("Done fetching")
    return {"data": 123}

async def main():
    # Run concurrently
    await asyncio.gather(fetch_data(), fetch_data())

# asyncio.run(main())`,
      },
    ],
  },
  {
    id: "advanced-concepts",
    title: "Advanced Concepts",
    description: "Comprehensions, Decorators, and Generators.",
    icon: "Zap",
    sections: [
      {
        id: "comprehensions",
        title: "Comprehensions",
        content: "Concise way to create lists, dictionaries, and sets.",
        code: `# List Comprehension
squares = [x**2 for x in range(10)]

# Dictionary Comprehension
square_dict = {x: x**2 for x in range(5)}

# Set Comprehension
unique_chars = {c for c in "hello world"}`,
      },
      {
        id: "decorators",
        title: "Decorators",
        content: "Functions that modify the behavior of other functions.",
        code: `def my_decorator(func):
    def wrapper():
        print("Before call")
        func()
        print("After call")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

# say_hello()
# Output:
# Before call
# Hello!
# After call`,
      },
      {
        id: "generators",
        title: "Generators",
        content:
          "Functions that return an iterator using the `yield` keyword. They are memory efficient.",
        code: `def count_up_to(n):
    count = 1
    while count <= n:
        yield count
        count += 1

counter = count_up_to(5)
for num in counter:
    print(num)`,
      },
    ],
  },
  {
    id: "memory-execution",
    title: "Memory & Execution",
    description: "How Python runs and manages memory.",
    icon: "Cpu",
    sections: [
      {
        id: "mutable-immutable",
        title: "Mutable vs Immutable",
        content: `
- **Mutable**: Can be changed after creation (list, dict, set).
- **Immutable**: Cannot be changed (int, float, str, tuple, bool).
        `,
        code: `# Immutable
s = "hello"
# s[0] = "H" # Raises TypeError

# Mutable
l = [1, 2, 3]
l[0] = 10 # Works fine`,
      },
      {
        id: "execution-model",
        title: "Execution Model",
        content: `
1. **Source Code** (.py)
2. **Bytecode** (.pyc) - Compiled by Python interpreter.
3. **Python Virtual Machine (PVM)** - Executes the bytecode.
        `,
        diagram: `graph LR
    A[Source Code .py] --> B[Compiler]
    B --> C[Bytecode .pyc]
    C --> D[PVM]
    D --> E[Machine Code]`,
      },
    ],
  },
  {
    id: "internals",
    title: "Python Internals",
    description: "How Python works under the hood: GIL, Memory Management.",
    icon: "Settings",
    sections: [
      {
        id: "gil",
        title: "Global Interpreter Lock (GIL)",
        content:
          "A mutex that allows only one thread to hold the control of the Python interpreter. This means multithreading is not suitable for CPU-bound tasks in CPython.",
        diagram: `graph LR
    T1[Thread 1] -- Wants to run --> GIL{GIL Locked?}
    T2[Thread 2] -- Wants to run --> GIL
    GIL -- Yes --> Wait[Wait]
    GIL -- No --> Execute[Execute Bytecode]`,
      },
      {
        id: "memory-management",
        title: "Memory Management",
        content:
          "Python uses **Reference Counting** and a **Garbage Collector** for cyclic references.",
        code: `import sys

a = []
b = a
print(sys.getrefcount(a)) # Output: 3 (a, b, and getrefcount arg)

# Cyclic Reference
l1 = []
l2 = []
l1.append(l2)
l2.append(l1)
# Garbage collector handles this cycle`,
        diagram: `graph TD
    Obj[Object]
    Ref1[Ref: a] --> Obj
    Ref2[Ref: b] --> Obj
    Count[Ref Count: 2] -.-> Obj`,
      },
    ],
  },
  {
    id: "imports-packages",
    title: "Imports & Packages",
    description: "Understanding how Python organizes and imports code.",
    icon: "FileCode",
    sections: [
      {
        id: "import-syntax",
        title: "Import Syntax",
        content: `
**from _ import _** is Python's way of bringing specific things into your file.

1. **Avoid long names**: \`from math import sqrt\` instead of \`math.sqrt()\`.
2. **Import only what you need**: Loads specific classes/functions.
3. **Cleaner code**: Makes it obvious what is being used.

**Variations:**
- \`import math\`: Import whole module (use \`math.sqrt()\`).
- \`from math import sqrt\`: Import specific function (use \`sqrt()\`).
- \`from math import *\`: Import everything (**NOT recommended** - pollutes namespace).
        `,
        code: `# Standard import
import os

# Specific import
from datetime import datetime

# Multiple imports
from typing import List, Dict, Optional

# Alias import
import pandas as pd`,
        diagram: `flowchart LR
    A[Your file: app.py] -->|from datetime import datetime| B[datetime module]
    A -->|import os| C[os module]
    A -->|import pandas as pd| D[pandas package]
    style A fill:#ccf,stroke:#333,stroke-width:2px
    style B fill:#efe,stroke:#333
    style C fill:#efe,stroke:#333
    style D fill:#efe,stroke:#333`,
      },
      {
        id: "packages-modules",
        title: "Packages & Modules",
        content: `
- **Module**: A single \`.py\` file.
- **Package**: A folder containing \`.py\` files and an \`__init__.py\` file.

**__init__.py**:
Used to mark a directory as a Python package. It can also be used to **re-export** classes from sub-modules to the top level, making imports shorter.
        `,
        code: `# Directory Structure:
# my_package/
#   __init__.py
#   models.py

# Inside __init__.py:
# from .models import MyModel

# User can then do:
from my_package import MyModel`,
        diagram: `flowchart TB
    P[my_package/ (package folder)] --> I[__init__.py]
    P --> M[models.py]
    I -->|from .models import MyModel| X[Re-export: MyModel]
    U[Your code] -->|from my_package import MyModel| X
    style P fill:#efe,stroke:#333
    style U fill:#ccf,stroke:#333,stroke-width:2px`,
      },
      {
        id: "direct-import-from-package",
        title: "How `from package import Class` Works",
        content: `
When you write:

\`from some_package import SomeClass\`

Python:
1. Finds the installed package \`some_package\`
2. Loads \`some_package/__init__.py\`
3. Imports \`SomeClass\` **if it is defined or re-exported** there

This is why many libraries expose a *clean public API* at the package root, even if the real class lives in a sub-module.
        `,
        code: `# Example package layout:
# some_package/
#   __init__.py
#   chat_models.py

# chat_models.py
class SomeClass:
    ...

# __init__.py (re-export)
from .chat_models import SomeClass

# Your code can now do:
from some_package import SomeClass

# Alternative (longer import path):
from some_package.chat_models import SomeClass`,
      },
      {
        id: "how-python-finds-imports",
        title: "How Python Finds What to Import",
        content: `
Python resolves imports by searching directories in **\`sys.path\`** (your script folder, installed site-packages, etc.).

If a name can't be found on that search path, you get **\`ModuleNotFoundError\`**.
        `,
        code: `import sys

for p in sys.path:
    print(p)

# Tip: the folder containing your running script
# is usually at/near the top of sys.path`,
      },
    ],
  },
  {
    id: "oop-classes",
    title: "Classes & Objects",
    description:
      "Understanding Classes, Objects, Attributes, Methods, and TypedDict.",
    icon: "Box",
    sections: [
      {
        id: "classes-objects",
        title: "Classes & Objects",
        content: `
**Class**: A blueprint.
**Object**: A thing created from that blueprint.
**Attributes**: Variables inside a class.
**Methods**: Functions inside a class.

**Real-life analogy:**
| Real World | Python |
| --- | --- |
| Blueprint of a Car | Class |
| A specific car (red BMW) | Object |
| Properties (color, model) | Attributes |
| Behaviors (drive, stop) | Methods |
        `,
        code: `class Car:
    def __init__(self, brand, color):
        self.brand = brand
        self.color = color

    def drive(self):
        return f"{self.brand} is driving!"

# Creating objects
car1 = Car("BMW", "Red")
print(car1.drive()) # BMW is driving!`,
        diagram: `graph TD
    Class[Class: Blueprint] --> Object[Object: Instance]
    Object --> Attributes[Attributes: Data]
    Object --> Methods[Methods: Behavior]
    Methods --> Self[self: The specific object]`,
      },
      {
        id: "class-vs-typeddict",
        title: "Class vs TypedDict",
        content: `
**Class**: Creates objects with behavior (methods) and data. Used for OOP.
**TypedDict**: Describes the **shape** of a dictionary (for type checking only). Does NOT create objects or have methods.

### One-line difference
- **class** → runtime objects + behavior
- **TypedDict** → type hints for dict keys (editor/type-checker help)

At runtime, a \`TypedDict\` value is still just a normal \`dict\`.

**TypedDict** is often used in LangGraph to define the state structure.
        `,
        code: `from typing import TypedDict

# TypedDict - Just a shape definition
class State(TypedDict):
    name: str
    output: str

# Valid dictionary matching the shape
state: State = {"name": "Vismay", "output": "Hello!"}

# Normal Class - Creates objects
class Car:
    def __init__(self, brand):
        self.brand = brand`,
        diagram: `flowchart LR
    A[Class] -->|creates| B[Object instances]
    C[TypedDict] -->|describes| D[dict shape]
    B --> E[Methods + attributes]
    D --> F[Keys + value types]
    style A fill:#efe,stroke:#333
    style C fill:#efe,stroke:#333
    style B fill:#ccf,stroke:#333,stroke-width:2px
    style D fill:#ccf,stroke:#333,stroke-width:2px`,
      },
    ],
  },
];
