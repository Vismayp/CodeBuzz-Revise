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
        id: "classes-inheritance",
        title: "Classes & Inheritance",
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
];
