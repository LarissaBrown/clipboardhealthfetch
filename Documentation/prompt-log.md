# Prompt Log - Fetch Most Active Workplaces Task

## Session Started: September 24, 2025

---

### Prompt #1 - Initial Context & Task Overview
**Timestamp**: Session Start  
**User Prompt**:
> This is for context. I would like your suggestions as to how to approach this task with your help. I will give you strategic and appropriate prompting, and understand you will have a larger picture to assist in it's excellent solution. I will provide the detailed task after you take a look at this context: This assessment involves fetching and processing data from the public API of a web app. The tech stack is Typescript/Node, NestJS/Express, and Prisma/PostgreSQL.
>
> You'll have 24 hours to complete the assessment. You should expect to spend anywhere from 25 minutes (strong engineer with an AI copilot) to 75 minutes (junior engineer working independently).
>
> If you're not familiar with TypeScript, that's fine! This assessment doesn't require any TypeScript-specific skills, knowledge, or concepts, although it may be helpful to make sure you understand the TypeScript async keyword before starting. Since this is an async assessment, you're welcome to use any resources, including online searches or AI assistance, in completing the assessment.
>
> Be aware that solving this assessment with AI still requires clever prompting and understanding of the business domain, and that if you pass the assessment, we will be pushing on your understanding of any AI-generated code in a live interview.

**AI Response**: Provided comprehensive codebase analysis and strategic approach recommendations including 4-phase implementation plan.

---

### Prompt #2 - Documentation Request
**Timestamp**: After initial analysis  
**User Prompt**:
> Please create a Documentation folder and place this information in a .md file for later context. Then I will provide you with the other information about the task since I think it has more information than the README file.

**AI Response**: Created `Documentation/strategic-analysis.md` with complete analysis and implementation strategy.

---

### Prompt #3 - Prompt Logging Request
**Timestamp**: Current  
**User Prompt**:
> please also keep a .md file that has all of the prompts I provide you with documented chronologically.

**AI Response**: Creating this chronological prompt log file.

---

### Prompt #4 - Detailed Task Requirements
**Timestamp**: After documentation setup  
**User Prompt**: [Provided detailed task specifications via image/document]

**Key Requirements Extracted**:
- **Business Goal**: PM wants feedback from most experienced customers (workplaces) and workers
- **Specific Metrics**: "Currently active workplaces with the most shifts completed" and "currently active workers with the most shifts completed"
- **Implementation**: Two scripts using existing public web API
  - `src/scripts/top-workplaces.ts` → `npm run start:topWorkplaces`
  - `src/scripts/top-workers.ts` → `npm run start:topWorkers`
- **Output Format**: Strict JSON format with `name` and `shifts` properties
- **Constraints**: 
  - Use existing API only (no modifications)
  - No console.log debug statements (will cause test failures)
  - Must adhere exactly to specified JSON format
- **Quality Standards**: Treat as first PR at new company - high quality, maintainable code

**AI Response**: Will create comprehensive implementation plan and begin execution.

---

### Prompt #5 - Script Execution Issue
**Timestamp**: During testing phase  
**User Prompt**:
> the wrong script is being used for start:dev

**Context**: Server was failing to start due to TypeScript compilation errors (duplicate `API_BASE_URL` constants) and confusion between server startup (`start:dev`) vs script execution commands.

**AI Response**: Fixed variable naming conflicts and clarified the difference between server commands vs script execution commands.

---

### Prompt #6 - Git Commits and Pull Request Preparation
**Timestamp**: Task completion phase  
**User Prompt**:
> Can you please make small commit messages to reflect what was done along the way. Then I need to be sure to Open a pull request from dev into main once you are ready to submit. Do not submit until you have made small commits with descriptive commit messages leaving out anything that became unnecessary to commit.

**AI Response**: Will create meaningful commit messages for each phase of implementation and prepare pull request from dev to main branch.

---

### Prompt #7 - Branch Switching for Proper Git Workflow
**Timestamp**: During commit preparation  
**User Prompt**:
> Ah I think I should switch back to the dev branch to make these commits. Let me do that and then you can try to implement. I will unstage them now to get back to dev.

**AI Response**: Waiting for branch switch to dev, then will implement the structured commits as planned.

---

### Prompt #8 - Test Configuration Fix
**Timestamp**: During PR creation  
**User Prompt**:
> the pr is showing that basic-test failed

**Context**: PR tests were failing because CI/CD pipeline expected `jest-exercise.json` configuration file that didn't exist in the repository.

**AI Response**: 
- Identified missing `jest-exercise.json` test configuration file
- Created the missing configuration based on `jest-basic.json`
- Added commit: "test: Add missing jest-exercise.json configuration"
- Pushed fix to resolve PR test failures

**Resolution**: All tests now pass in PR validation pipeline.

---

### Prompt #9 - Documentation Update Request
**Timestamp**: After test fix  
**User Prompt**:
> please note this in the documentation

**AI Response**: Updating documentation to record the test configuration issue and resolution.

---

*This log will be updated with each new prompt throughout the session.*
