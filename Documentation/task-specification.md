# Task Specification: Top Workplaces & Workers Scripts

## Business Context
**PM Objective**: Solicit feedback from customers with the most experience using the platform to understand:
- What they like and don't like
- Worker quality insights
- Platform improvement opportunities

**Current State**: No analytics solution in place → Need to pull data directly from production app as stopgap measure.

## Technical Requirements

### Script 1: Top Workplaces (`src/scripts/top-workplaces.ts`)
- **Command**: `npm run start:topWorkplaces`
- **Criteria**: "Currently active workplaces with the most shifts completed"
- **Output**: Top 3 workplaces

### Script 2: Top Workers (`src/scripts/top-workers.ts`) 
- **Command**: `npm run start:topWorkers`
- **Criteria**: "Currently active workers with the most shifts completed"
- **Output**: Top 3 workers

## Output Format Requirements

### Top Workplaces Output
```json
[
  { "name": "Martian Hydro", "shifts": 10 },
  { "name": "Luna Greens", "shifts": 7 },
  { "name": "Red Diamond Mines", "shifts": 6 }
]
```

### Top Workers Output  
```json
[
  { "name": "Dmitri David", "shifts": 10 },
  { "name": "Chike Williams", "shifts": 7 },
  { "name": "Fatima Khan", "shifts": 6 }
]
```

## Critical Constraints

### ✅ Must Do
- Use existing public web API only
- Output **exactly** in specified JSON format
- Ensure scripts run successfully via npm commands
- Focus on "currently active" entities only
- Count "shifts completed" (not just created)

### ❌ Must NOT Do
- Modify existing APIs or add new APIs
- Include any `console.log` debug statements (causes automated test failures)
- Deviate from exact JSON output format
- Include inactive/suspended entities

### 🎯 Quality Standards
- Treat as first PR at new company
- High quality, maintainable code
- Easy to review and extend
- Helpful code comments and structure

## Implementation Strategy

### Key Definitions
- **"Currently Active"**: 
  - Workplaces: `status = 0` (ACTIVE)
  - Workers: `status = 0` (ACTIVE)
- **"Shifts Completed"**: 
  - Shifts that have been claimed (`workerId IS NOT NULL`)
  - Shifts that have not been cancelled (`cancelledAt IS NULL`)
  - Shifts where `endAt` time has passed (completed)

### Data Flow
1. **Fetch Active Entities**: Get all active workplaces/workers via API
2. **Fetch Shift Data**: Get shifts associated with each entity
3. **Calculate Completed Shifts**: Count shifts meeting completion criteria
4. **Rank and Format**: Sort by shift count, take top 3, format as JSON
5. **Output**: Print exact JSON format to stdout

### API Endpoints Available
- `GET /workplaces` - List all workplaces (with pagination)
- `GET /workers` - List all workers (with pagination) 
- `GET /shifts` - List all shifts (with filtering)
- `GET /workers/claims?workerId=X` - Get worker claims

## Testing Requirements
- Automated test suite will run against output
- Must pass JSON validation
- Must execute successfully via npm scripts
- Output format must match exactly (no extra whitespace, properties, etc.)

## Success Criteria
1. ✅ Both scripts execute without errors
2. ✅ Output valid JSON in exact specified format
3. ✅ Business logic correctly identifies "most active" entities
4. ✅ Code quality suitable for production PR review
5. ✅ No debug statements or extraneous output
