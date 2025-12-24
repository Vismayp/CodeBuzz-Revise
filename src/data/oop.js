export const topics = [
  {
    id: "oop-fundamentals",
    title: "OOP Fundamentals",
    description: "The building blocks of Object-Oriented Programming.",
    icon: "Box",
    sections: [
      {
        id: "classes-objects",
        title: "Classes & Objects",
        content: `
Object-Oriented Programming (OOP) is a paradigm based on the concept of "objects", which can contain data (attributes) and code (methods).

### Key Concepts:
1. **Class**: A blueprint or template for creating objects. It defines the properties and behaviors.
2. **Object**: An instance of a class. It represents a specific entity with actual data.
3. **Attributes (Fields)**: Variables within a class that hold data.
4. **Methods**: Functions defined inside a class that describe behaviors.

Think of a **Class** as a "Car Blueprint" and an **Object** as a specific "Red Toyota Camry".
        `,
        code: `// Java Example
class Car {
    // Attributes
    String brand;
    String model;
    int year;

    // Method
    void startEngine() {
        System.out.println(brand + " " + model + " engine started.");
    }
}

public class Main {
    public static void main(String[] args) {
        // Creating an Object (Instantiation)
        Car myCar = new Car();
        myCar.brand = "Toyota";
        myCar.model = "Camry";
        myCar.year = 2022;

        myCar.startEngine(); // Output: Toyota Camry engine started.
    }
}`,
      },
      {
        id: "constructors-destructors",
        title: "Constructors & Destructors",
        content: `
### Constructors
A special method invoked when an object is created. It is used to initialize the object's state.
- **Default Constructor**: No arguments.
- **Parameterized Constructor**: Takes arguments to set initial values.

### Destructors
A method called when an object is destroyed or garbage collected (common in C++, less explicit in Java/Python due to automatic Garbage Collection). In Java, \`finalize()\` was used but is now deprecated.

In Java, we rely on the **Garbage Collector** to free memory, but we can use \`try-with-resources\` for resource management.
        `,
        code: `class Book {
    String title;
    String author;

    // Parameterized Constructor
    public Book(String title, String author) {
        this.title = title;
        this.author = author;
        System.out.println("Book created: " + title);
    }
}

public class Main {
    public static void main(String[] args) {
        Book b1 = new Book("The Alchemist", "Paulo Coelho");
    }
}`,
      },
    ],
  },
  {
    id: "four-pillars",
    title: "The Four Pillars",
    description: "The core principles that define OOP power and flexibility.",
    icon: "Columns",
    sections: [
      {
        id: "encapsulation",
        title: "Encapsulation",
        content: `
**Encapsulation** is the bundling of data (variables) and methods that operate on that data into a single unit (class). It also involves restricting direct access to some of an object's components.

### Access Modifiers:
1. **Public**: Accessible from anywhere.
2. **Private**: Accessible only within the class.
3. **Protected**: Accessible within the package and subclasses.
4. **Default (Package-Private)**: Accessible only within the same package (Java specific).

We use **Getters** and **Setters** to access and update private variables securely.
        `,
        code: `class BankAccount {
    private double balance; // Private data

    public BankAccount(double initialBalance) {
        if (initialBalance > 0) {
            this.balance = initialBalance;
        }
    }

    // Getter
    public double getBalance() {
        return balance;
    }

    // Setter with validation
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
}`,
      },
      {
        id: "abstraction",
        title: "Abstraction",
        content: `
**Abstraction** is the concept of hiding the complex implementation details and showing only the essential features of the object.

### Ways to achieve Abstraction:
1. **Abstract Classes**: Can have both abstract (no body) and concrete methods. Cannot be instantiated.
2. **Interfaces**: A contract that a class must adhere to. In Java, methods are abstract by default (until Java 8 added default methods).

Use Abstraction when you want to define *what* something does, not *how* it does it.
        `,
        code: `// Abstract Class
abstract class Animal {
    abstract void makeSound(); // Abstract method

    void sleep() { // Concrete method
        System.out.println("Zzz");
    }
}

// Interface
interface Flyable {
    void fly();
}

class Bird extends Animal implements Flyable {
    public void makeSound() {
        System.out.println("Chirp");
    }
    public void fly() {
        System.out.println("Flying high!");
    }
}`,
      },
      {
        id: "inheritance",
        title: "Inheritance",
        content: `
**Inheritance** allows a class (Child/Subclass) to acquire the properties and behaviors of another class (Parent/Superclass). It promotes code reusability.

### Types of Inheritance:
1. **Single**: A -> B
2. **Multilevel**: A -> B -> C
3. **Hierarchical**: A -> B, A -> C
4. **Multiple**: A, B -> C (Not supported in Java classes, but supported via Interfaces)
5. **Hybrid**: Combination of above.

The \`super\` keyword is used to refer to the parent class objects (variables, methods, constructors).
        `,
        diagram: `classDiagram
    class Animal {
        +eat()
    }
    class Dog {
        +bark()
    }
    class Cat {
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
        code: `class Vehicle {
    protected String brand = "Ford";
    public void honk() {
        System.out.println("Tuut, tuut!");
    }
}

class Car extends Vehicle {
    private String modelName = "Mustang";

    public static void main(String[] args) {
        Car myCar = new Car();
        myCar.honk(); // Inherited method
        System.out.println(myCar.brand + " " + myCar.modelName);
    }
}`,
      },
      {
        id: "polymorphism",
        title: "Polymorphism",
        content: `
**Polymorphism** means "many forms". It allows objects to be treated as instances of their parent class rather than their actual class.

### Types:
1. **Compile-time (Static)**: Method Overloading. Same method name, different parameters.
2. **Runtime (Dynamic)**: Method Overriding. Child class provides specific implementation of a method already defined in Parent class.
        `,
        code: `class MathUtils {
    // Overloading
    int add(int a, int b) { return a + b; }
    double add(double a, double b) { return a + b; }
}

class Animal {
    void sound() { System.out.println("Animal makes a sound"); }
}

class Pig extends Animal {
    // Overriding
    @Override
    void sound() { System.out.println("Wee Wee"); }
}

public class Main {
    public static void main(String[] args) {
        Animal myPig = new Pig();
        myPig.sound(); // Outputs "Wee Wee" (Runtime Polymorphism)
    }
}`,
      },
    ],
  },
  {
    id: "relationships",
    title: "Relationships",
    description:
      "How objects interact: Association, Aggregation, and Composition.",
    icon: "Network",
    sections: [
      {
        id: "has-a-relationships",
        title: "Association, Aggregation, Composition",
        content: `
These define "Has-A" relationships, distinct from Inheritance ("Is-A").

### 1. Association
A general relationship where all objects have their own lifecycle and there is no owner.
*   *Example*: Teacher and Student.

### 2. Aggregation (Weak Association)
A specialized form of association where a child can exist independently of the parent.
*   *Example*: Library and Book. If Library is destroyed, Books still exist.

### 3. Composition (Strong Association)
The child cannot exist without the parent. If the parent is destroyed, the child is destroyed.
*   *Example*: House and Room. A Room cannot exist without a House.
        `,
        diagram: `classDiagram
    class Teacher
    class Student
    Teacher --> Student : Association

    class Library
    class Book
    Library o-- Book : Aggregation

    class House
    class Room
    House *-- Room : Composition`,
        code: `// Composition Example
class Room {
    String name;
    Room(String name) { this.name = name; }
}

class House {
    private List<Room> rooms;

    House() {
        rooms = new ArrayList<>();
        // Rooms are created inside House. 
        // If House dies, rooms die.
        rooms.add(new Room("Kitchen")); 
        rooms.add(new Room("Bedroom"));
    }
}`,
      },
    ],
  },
  {
    id: "solid-principles",
    title: "SOLID Principles",
    description:
      "The five design principles for maintainable and scalable software.",
    icon: "ShieldCheck",
    sections: [
      {
        id: "solid-overview",
        title: "S.O.L.I.D Explained",
        content: `
**S - Single Responsibility Principle (SRP)**
A class should have only one reason to change. It should have only one job.

**O - Open/Closed Principle (OCP)**
Software entities should be open for extension, but closed for modification. Use interfaces/abstract classes instead of modifying existing code.

**L - Liskov Substitution Principle (LSP)**
Objects of a superclass should be replaceable with objects of a subclass without affecting the correctness of the program.

**I - Interface Segregation Principle (ISP)**
Clients should not be forced to depend upon interfaces that they do not use. Split large interfaces into smaller ones.

**D - Dependency Inversion Principle (DIP)**
High-level modules should not depend on low-level modules. Both should depend on abstractions.
        `,
        code: `// SRP Violation
class User {
    void saveToDatabase() { ... } // Mixing logic
    void sendEmail() { ... }      // Mixing logic
}

// SRP Correct
class UserRepository {
    void save(User u) { ... }
}
class EmailService {
    void sendEmail(User u) { ... }
}

// OCP Example
interface Shape {
    double calculateArea();
}
// We can add new shapes without modifying existing AreaCalculator logic
class Circle implements Shape { ... }
class Rectangle implements Shape { ... }`,
      },
    ],
  },
  {
    id: "advanced-concepts",
    title: "Advanced Concepts",
    description: "Static members, Final keyword, and architectural metrics.",
    icon: "Zap",
    sections: [
      {
        id: "static-final",
        title: "Static & Final",
        content: `
### Static
The \`static\` keyword belongs to the class rather than an instance.
- **Static Variable**: Shared among all instances.
- **Static Method**: Can be called without creating an object.

### Final
The \`final\` keyword restricts the user.
- **Final Variable**: Constant, cannot be changed.
- **Final Method**: Cannot be overridden.
- **Final Class**: Cannot be inherited.
        `,
        code: `class MathConstants {
    static final double PI = 3.14159; // Constant shared by all
    
    static int square(int x) {
        return x * x;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(MathConstants.PI);
        System.out.println(MathConstants.square(5));
    }
}`,
      },
      {
        id: "coupling-cohesion",
        title: "Coupling vs Cohesion",
        content: `
### Cohesion (Good)
Refers to the degree to which the elements inside a module belong together.
- **High Cohesion**: A class does one thing and does it well (follows SRP).

### Coupling (Bad)
Refers to the degree of direct knowledge that one element has of another.
- **Loose Coupling**: Classes are independent. Changes in one don't break others.
- **Tight Coupling**: Classes are highly dependent.

**Goal**: High Cohesion and Loose Coupling.
        `,
      },
    ],
  },
  {
    id: "design-patterns",
    title: "Design Patterns",
    description: "Reusable solutions to common problems.",
    icon: "Layers",
    sections: [
      {
        id: "patterns-overview",
        title: "Overview & Examples",
        content: `
Design patterns are typical solutions to common problems in software design.

### Categories:
1. **Creational**: Object creation mechanisms (e.g., Singleton, Factory, Builder).
2. **Structural**: How to assemble objects and classes (e.g., Adapter, Decorator).
3. **Behavioral**: Communication between objects (e.g., Observer, Strategy).

### Singleton Pattern
Ensures a class has only one instance and provides a global point of access to it.

### Factory Pattern
Defines an interface for creating an object, but lets subclasses alter the type of objects that will be created.
        `,
        diagram: `classDiagram
    class Singleton {
        -static instance: Singleton
        -Singleton()
        +static getInstance(): Singleton
    }`,
        code: `// Singleton Example
class Database {
    private static Database instance;

    private Database() {} // Private constructor

    public static Database getInstance() {
        if (instance == null) {
            instance = new Database();
        }
        return instance;
    }
}

// Factory Example
interface Transport {
    void deliver();
}
class Truck implements Transport {
    public void deliver() { System.out.println("Deliver by land"); }
}
class Ship implements Transport {
    public void deliver() { System.out.println("Deliver by sea"); }
}

class Logistics {
    public Transport createTransport(String type) {
        if (type.equals("road")) return new Truck();
        if (type.equals("sea")) return new Ship();
        return null;
    }
}`,
      },
    ],
  },
];
