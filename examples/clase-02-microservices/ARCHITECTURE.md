# Microservices Architecture Diagrams

## Current Setup (Docker - Development)

```
┌─────────────────────────────────────────────────────────────┐
│                      Your Computer                          │
│                                                             │
│  Browser/Client                                             │
│       │                                                     │
│       │ HTTP Request                                        │
│       ▼                                                     │
│  ┌─────────────────┐                                        │
│  │   API Gateway   │  (nginx - Port 3000)                   │
│  │   (nginx)       │                                        │
│  └────────┬────────┘                                        │
│           │                                                 │
│           │  Routes based on URL path                       │
│  ┌────────┴─────────────────────────────────┐               │
│  │                                          │               │
│  ▼                    ▼                     ▼               │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│ │ Enrollment   │  │ Student Data │  │  Subjects    │        │
│ │ Service      │  │ Service      │  │  Service     │        │
│ │ :3000        │  │ :3000        │  │  :3000       │        │
│ │ (Next.js)    │  │ (Next.js)    │  │ (Next.js)    │        │
│ └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                             │
│         Docker Bridge Network (Internal)                    │
└─────────────────────────────────────────────────────────────┘

Routing Rules:
  /enrollment/*    → Enrollment Service
  /student-data/*  → Student Data Service
  /subjects/*      → Subjects Service
```

---

## Pattern 1: Public Microservices (AWS/Cloud - Simple)

```
                          ┌─────────────────┐
                          │    Internet     │
                          └────────┬────────┘
                                   │
                                   │ HTTPS
                                   ▼
                          ┌─────────────────┐
                          │  Load Balancer  │
                          │   or Gateway    │
                          │  (Public IP)    │
                          └────────┬────────┘
                                   │
                     ┌─────────────┴─────────────┐
                     │                           │
                     │    Public Subnet (VPC)    │
                     │                           │
         ┌───────────┼───────────────┬───────────┼───────────┐
         ▼           ▼               ▼           ▼           ▼
    ┌────────┐  ┌────────┐      ┌────────┐  ┌────────┐  ┌────────┐
    │Service │  │Service │      │Service │  │Service │  │Service │
    │   A    │  │   B    │  ... │   C    │  │   D    │  │   E    │
    └────────┘  └────────┘      └────────┘  └────────┘  └────────┘
         │           │               │           │           │
         └───────────┴───────────────┴───────────┴───────────┘
                                   │
                                   ▼
                          Direct Internet Access
                          (Can call external APIs)

✅ Pros:
  - Simple setup
  - Direct internet access
  - Lower cost (no NAT Gateway)

❌ Cons:
  - Less secure (services exposed)
  - Services have public IPs
  - Harder to control outbound traffic
```

---

## Pattern 2: Private Microservices with NAT (AWS/Cloud - Recommended)

```
                          ┌─────────────────┐
                          │    Internet     │
                          └────┬───────▲────┘
                               │       │
                    Inbound    │       │    Outbound
                    Traffic    │       │    Traffic
                               ▼       │
                          ┌─────────────────┐
                          │  API Gateway    │
                          │ or Load Balancer│
                          │  (Public Subnet)│
                          └────────┬────────┘
                                   │
                                   │ Routes Requests
     ┌─────────────────────────────┼─────────────────────────────┐
     │                             │                             │
     │                    Private Subnet (VPC)                   │
     │                                                           │
     │         ┌───────────────────┴───────────────┐             │
     │         ▼                   ▼               ▼             │
     │    ┌────────┐          ┌────────┐      ┌────────┐         │
     │    │Service │          │Service │      │Service │         │
     │    │   A    │          │   B    │  ... │   C    │         │
     │    └────┬───┘          └────┬───┘      └────┬───┘         │
     │         │                   │               │             │
     │         └───────────────────┴───────────────┘             │
     │                             │                             │
     │                             │ Need external API?          │
     │                             ▼                             │
     │                      ┌─────────────┐                      │
     │                      │ NAT Gateway │                      │
     │                      │   (Public   │                      │
     │                      │   Subnet)   │                      │
     │                      └──────┬──────┘                      │
     └─────────────────────────────┼─────────────────────────────┘
                                   │
                                   ▼
                            External APIs
                     (Payment, Email, 3rd party)

✅ Pros:
  - Highly secure (services isolated)
  - No public IPs on services
  - Controlled outbound access
  - Industry best practice

❌ Cons:
  - More complex setup
  - NAT Gateway costs money
  - Additional configuration
```

---

## Your Enrollment Platform - Production Example

```
┌──────────────────────────────────────────────────────────────────┐
│                         Internet                                 │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ User requests
                             ▼
                    ┌──────────────────┐
                    │   Load Balancer  │  (Public Subnet)
                    │    or Gateway    │
                    │  (nginx/AWS ALB) │
                    └────────┬─────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │              Private Subnet             │
        │                                         │
        │  ┌─────────────────────────────────┐    │
        │  │     Enrollment Service          │    │
        │  │  /enrollment/* → Port 3000      │────┼──┐
        │  └─────────────────────────────────┘    │  │
        │                                         │  │
        │  ┌─────────────────────────────────┐    │  │
        │  │     Student Data Service        │    │  │
        │  │  /student-data/* → Port 3000    │────┼──┤
        │  └─────────────────────────────────┘    │  │
        │                                         │  │
        │  ┌─────────────────────────────────┐    │  │
        │  │     Subjects Service            │    │  │
        │  │  /subjects/* → Port 3000        │────┼──┤
        │  └─────────────────────────────────┘    │  │
        │                                         │  │
        └─────────────────────────────────────────┘  │
                                                     │
                            Need to call:            │
                            - Email Service          │
                            - Payment Gateway        │
                            - External Database      │
                                                     │
                                                     ▼
                                            ┌──────────────┐
                                            │ NAT Gateway  │
                                            └──────┬───────┘
                                                   │
                                                   ▼
                                          External Services
```

---

## Key Concepts for Students

### **API Gateway / Load Balancer**
- **Role**: Front door for all requests
- **Function**: Routes traffic to correct service based on URL path
- **Examples**: nginx, AWS ALB, AWS API Gateway, Kong
- **Always needed**: YES ✅

### **NAT Gateway**
- **Role**: Allows private services to access internet
- **Function**: Translates private IPs to public IP for outbound traffic
- **Examples**: AWS NAT Gateway, Azure NAT Gateway
- **Always needed**: Only if services are private AND need internet access

### **When to use NAT Gateway?**
- ✅ Services in private subnets need to call external APIs
- ✅ Services need to download updates/packages
- ✅ Services need to connect to external databases
- ❌ Services never make outbound calls
- ❌ All services are in public subnets (not recommended for production)

### **Security Best Practice**
Always use **Pattern 2** (Private Microservices + NAT) in production for:
- Better security isolation
- Controlled network access
- Compliance requirements
- Protection against attacks
