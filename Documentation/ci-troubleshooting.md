# CI/CD Pipeline Troubleshooting Guide

## Overview
This document records the CI/CD pipeline issues encountered during development and their resolutions. This serves as a reference for similar problems in future projects.

## Issue Timeline

### Issue 1: Missing Jest Configuration File
**Date**: During initial PR submission  
**Error**: `Can't find a root directory while resolving a config file path. Provided path to resolve: ./jest-exercise.json`

**Root Cause**: The GitHub Actions workflow expected a `jest-exercise.json` configuration file that didn't exist in the repository.

**Solution**: Created the missing configuration file based on the existing `jest-basic.json`:
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node", 
  "testRegex": "basic-functionality\\.spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "reporters": [["default", { "summaryThreshold": 1 }]]
}
```

### Issue 2: CI Workflow Configuration Problems
**Date**: After test configuration fix  
**Error**: `Error: Failed to get top workplaces: fetch failed`

**Root Cause Analysis**: Multiple workflow issues identified in `.github/workflows/basic-test.yml`:

1. **Wrong Server Command**: Used `npm run start` instead of `npm run start:dev`
2. **Incorrect Step Order**: Database setup occurred after server start
3. **Insufficient Wait Time**: Only 10 seconds for server startup
4. **No Health Verification**: Tests ran without confirming server readiness

**Original Problematic Workflow**:
```yaml
- name: Start server
  working-directory: ./server
  run: npm run start &

- name: Wait for server to start
  run: sleep 10

- name: Set up database and seed data
  working-directory: ./server
  run: npx prisma migrate dev --name init
```

**Fixed Workflow**:
```yaml
- name: Set up database and seed data
  working-directory: ./server
  run: export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 && npx prisma migrate dev --name init

- name: Start server
  working-directory: ./server
  run: npm run start:dev &

- name: Wait for server to start
  run: sleep 15

- name: Health check server
  run: |
    for i in {1..30}; do
      if curl -f http://localhost:3000/workplaces > /dev/null 2>&1; then
        echo "Server is ready!"
        break
      fi
      echo "Waiting for server... ($i/30)"
      sleep 2
    done
```

## Key Learnings

### 1. Initialization Order Matters
- Database must be set up before starting the server
- Dependencies should be installed before any other operations
- Server must be fully ready before running tests

### 2. Environment Differences
- Local development vs CI environments can have different timing requirements
- What works locally may need adjustments for CI environments
- Always include health checks in CI workflows

### 3. Proper Error Handling
- Use health checks to verify service readiness
- Include retry logic for network-dependent operations
- Provide meaningful error messages for debugging

### 4. Configuration Management
- Ensure all required configuration files are committed
- Maintain consistency between local and CI test configurations
- Document any environment-specific requirements

## Best Practices Established

1. **Always include health checks** before running integration tests
2. **Use appropriate wait times** for service startup in CI environments
3. **Maintain proper step ordering** in CI workflows
4. **Keep configuration files in sync** between local and CI environments
5. **Document troubleshooting steps** for future reference

## Resolution Timeline
- **Initial Issue**: Missing test configuration file
- **Quick Fix**: Created jest-exercise.json 
- **Deeper Issue**: CI workflow problems identified
- **Comprehensive Fix**: Reordered steps, added health checks, increased timeouts
- **Final Result**: All tests passing consistently

This troubleshooting process demonstrates the importance of systematic problem-solving and thorough testing in CI/CD environments.
