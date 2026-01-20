// backend/services/diagrams.js
const { SDLC_TYPES, ARCH_TYPES } = require("../data/constants");

// --- 1. ARCHITECTURE TEMPLATES ---
const getArchTemplate = (archType) => {
  switch (archType) {
    case ARCH_TYPES.MONOLITHIC:
      return `graph TD
    User((User)) -->|HTTPS| LB[Load Balancer]
    subgraph "Single Server / Cluster"
        LB --> Monolith[Monolithic App]
        Monolith -->|Reads/Writes| DB[(Primary Database)]
        Monolith -->|Cache| Redis[Redis Cache]
    end
    style Monolith fill:#f9f,stroke:#333,stroke-width:4px`;

    case ARCH_TYPES.MICROSERVICES:
      return `graph TD
    User((User)) -->|HTTPS| Gateway[API Gateway]
    subgraph "Microservices Cluster"
        Gateway --> Auth[Auth Service]
        Gateway --> Order[Order Service]
        Gateway --> Product[Product Service]
        Order -->|Async Event| Broker{Kafka/RabbitMQ}
        Broker -->|Consume| Inventory[Inventory Service]
    end
    Auth --> DB1[(Auth DB)]
    Order --> DB2[(Order DB)]
    Product --> DB3[(Product DB)]
    style Gateway fill:#f9f,stroke:#333,stroke-width:4px`;

    case ARCH_TYPES.LAYERED:
      return `graph TD
    User((User)) --> UI[Presentation Layer]
    UI --> BLL[Business Logic Layer]
    BLL --> DAL[Data Access Layer]
    DAL --> DB[(Database)]
    subgraph "Security"
        UI -.-> Auth[Authentication]
        BLL -.-> Auth
    end
    style BLL fill:#f9f,stroke:#333,stroke-width:2px`;

    case ARCH_TYPES.EVENT_DRIVEN:
      return `graph TD
    Source((Event Source)) -->|Emits| Bus{Event Bus}
    Bus -->|Subscribes| ServiceA[Consumer A]
    Bus -->|Subscribes| ServiceB[Consumer B]
    Bus -->|Subscribes| ServiceC[Analytics]
    ServiceA --> DB[(Database)]
    style Bus fill:#f96,stroke:#333,stroke-width:4px`;

    default:
      return `graph TD; User --> System; System --> Database`;
  }
};

// --- 2. PROCESS TEMPLATES ---
const getProcessTemplate = (model) => {
  if (model.includes("Agile")) {
    return `stateDiagram-v2
    [*] --> Backlog
    Backlog --> SprintPlanning
    SprintPlanning --> Development
    Development --> Testing
    Testing --> Review
    Review --> Deployment : "Success"
    Review --> Backlog : "Feedback / Changes"
    Deployment --> [*]`;
  } else if (model.includes("Waterfall")) {
    return `graph TD
    Req[Requirements] --> Design
    Design --> Implementation
    Implementation --> Verification
    Verification --> Maintenance
    style Req fill:#f9f`;
  } else if (model.includes("V-Model")) {
    return `graph TD
    Req[Requirements] --- AccTest[Acceptance Test]
    SysDes[System Design] --- SysTest[System Test]
    Arch[Arch Design] --- IntTest[Integration Test]
    Code[Coding]
    Req --> SysDes
    SysDes --> Arch
    Arch --> Code
    Code --> IntTest
    IntTest --> SysTest
    SysTest --> AccTest`;
  } else {
    // General Fallback
    return `graph LR; Plan --> Code --> Test --> Deploy`;
  }
};

// --- 3. EXPORTABLE FUNCTION ---
const generateBlueprints = (plan) => {
  return {
    processDiagram: getProcessTemplate(plan.model),
    systemDiagram: getArchTemplate(plan.architecture.model),
  };
};

module.exports = { generateBlueprints };
