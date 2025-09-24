# Strategic Analysis: Fetch Most Active Workplaces Task

## Assessment Context
This assessment involves fetching and processing data from the public API of a web app using TypeScript/Node, NestJS/Express, and Prisma/PostgreSQL stack.

**Time Allocation**: 25-75 minutes (depending on experience level with AI assistance)

## Current Codebase Analysis

### Infrastructure Overview
- **Tech Stack**: TypeScript/Node.js, NestJS, Prisma ORM, SQLite database
- **Architecture**: Modular NestJS application with proper separation of concerns
- **Database Schema**: Three main entities with clear relationships:
  - `Worker`: Individual workers who can claim shifts
  - `Workplace`: Business locations that post shifts
  - `Shift`: Work assignments connecting workers and workplaces

### Key Data Relationships
```
Workplace (1) ←→ (many) Shift (many) ←→ (1) Worker
```

### Current Implementation Status
- ✅ Complete CRUD operations for all entities
- ✅ Shift claiming/canceling functionality
- ✅ Proper pagination and filtering
- ✅ Database seeding with realistic test data
- ❌ **Missing**: `top-workplaces.ts` script implementation (current placeholder)

### Test Requirements
Based on `test/basic-functionality.spec.ts`:
1. Script must execute successfully via `npm run start:topWorkplaces`
2. Must output valid JSON
3. Output must be a non-empty array

## Strategic Approach

### Phase 1: Requirements Analysis & Definition (5-10 minutes)
**Objectives:**
- Define "most active workplace" criteria
- Analyze available data points
- Determine ranking methodology

**Key Considerations:**
- Should activity be based on total shifts, recent shifts, or completion rates?
- How to handle workplace status (active vs suspended/closed)?
- What time period should be considered for "activity"?

### Phase 2: Implementation (15-25 minutes)
**Technical Implementation:**
- Implement core ranking algorithm in `server/src/scripts/top-workplaces.ts`
- Use Prisma aggregation queries for efficient data retrieval
- Structure JSON output to meet test validation requirements
- Handle edge cases (ties, inactive workplaces, empty data)

**Potential Activity Metrics:**
1. **Total Shifts Created**: Raw volume of shift postings
2. **Recent Activity**: Time-weighted recent shift activity
3. **Shift Fill Rate**: Percentage of shifts that get claimed
4. **Active Shifts**: Currently ongoing or upcoming shifts

### Phase 3: Testing & Validation (5-15 minutes)
- Run existing test suite for compliance
- Validate with seeded data
- Performance testing
- Business logic verification

### Phase 4: Enhancement & Documentation (5-10 minutes)
- Error handling implementation
- Performance optimization considerations
- Documentation of ranking methodology

## Technical Architecture Notes

### Database Schema Insights
```sql
-- Workplace entity
model Workplace {
  id       Int    @id @default(autoincrement())
  name     String
  status   Int    @default(0)  // 0=ACTIVE, 1=SUSPENDED, 2=CLOSED
  location String
  shifts   Shift[]
}

-- Shift entity with workplace relationship
model Shift {
  id          Int       @id @default(autoincrement())
  createdAt   DateTime  @default(now())
  startAt     DateTime
  endAt       DateTime
  workplaceId Int
  workerId    Int?      // null = unclaimed
  cancelledAt DateTime? // null = not cancelled
  workplace   Workplace @relation(fields: [workplaceId], references: [id])
}
```

### Available Data Points for Activity Calculation
- Shift creation timestamps (`createdAt`)
- Shift scheduling (`startAt`, `endAt`)
- Claim status (`workerId` null/not null)
- Cancellation status (`cancelledAt`)
- Workplace operational status (`status`)

## Expected Deliverables
1. **Functional Script**: `top-workplaces.ts` that executes successfully
2. **JSON Output**: Valid JSON array of workplace activity rankings
3. **Test Compliance**: Passes existing basic functionality tests
4. **Business Logic**: Defensible methodology for determining "most active"

## Success Metrics
- ✅ Tests pass (JSON output validation)
- ✅ Business logic is defensible and makes sense
- ✅ Performance is acceptable with seeded data
- ✅ Code follows existing codebase patterns
- ✅ Output provides actionable business insights

## Next Steps
Awaiting detailed task requirements to refine implementation approach and define specific "activity" criteria.
