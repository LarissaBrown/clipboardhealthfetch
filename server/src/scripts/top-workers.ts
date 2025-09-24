/**
 * Top Workers Script
 * 
 * Fetches the top 3 currently active workers with the most shifts completed.
 * A completed shift is one that has been claimed by a worker, not cancelled, 
 * and has already ended.
 * 
 * Output format: JSON array with { name, shifts } objects
 */

interface Worker {
  id: number;
  name: string;
  status: number;
}

interface Shift {
  id: number;
  createdAt: string;
  startAt: string;
  endAt: string;
  workplaceId: number;
  workerId: number | null;
  cancelledAt: string | null;
}

interface ApiResponse<T> {
  data: T;
}

interface PaginatedApiResponse<T> {
  data: T[];
  links: { next?: string };
}

interface WorkerResult {
  name: string;
  shifts: number;
}

const WORKERS_API_BASE_URL = 'http://localhost:3000';

/**
 * Fetches all active workers from the API
 */
async function fetchActiveWorkers(): Promise<Worker[]> {
  const workers: Worker[] = [];
  let currentUrl: string | null = `${WORKERS_API_BASE_URL}/workers`;
  
  while (currentUrl) {
    const response = await fetch(currentUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch workers: ${response.status}`);
    }
    
    const result: PaginatedApiResponse<Worker> = await response.json();
    
    // Filter for active workers only (status = 0)
    const activeWorkers = result.data.filter(worker => worker.status === 0);
    workers.push(...activeWorkers);
    
    // Check if there's a next page
    currentUrl = result.links.next || null;
  }
  
  return workers;
}

/**
 * Fetches claimed shifts for a specific worker and counts completed ones
 */
async function countCompletedShiftsForWorker(workerId: number): Promise<number> {
  let completedShifts = 0;
  let currentUrl: string | null = `${WORKERS_API_BASE_URL}/workers/claims?workerId=${workerId}`;
  
  const now = new Date();
  
  while (currentUrl) {
    const response = await fetch(currentUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch worker claims: ${response.status}`);
    }
    
    const result: PaginatedApiResponse<Shift> = await response.json();
    
    // Count completed shifts for this worker
    const workerCompletedShifts = result.data.filter(shift => 
      shift.cancelledAt === null &&        // Not cancelled
      new Date(shift.endAt) < now          // Has ended
    );
    
    completedShifts += workerCompletedShifts.length;
    
    // Check if there's a next page
    currentUrl = result.links.next || null;
  }
  
  return completedShifts;
}

/**
 * Main function to get top 3 workers by completed shifts
 */
async function getTopWorkers(): Promise<WorkerResult[]> {
  try {
    // Fetch all active workers
    const activeWorkers = await fetchActiveWorkers();
    
    // Calculate completed shifts for each worker
    const workerResults: WorkerResult[] = [];
    
    for (const worker of activeWorkers) {
      const completedShifts = await countCompletedShiftsForWorker(worker.id);
      workerResults.push({
        name: worker.name,
        shifts: completedShifts
      });
    }
    
    // Sort by completed shifts (descending) and take top 3
    workerResults.sort((a, b) => b.shifts - a.shifts);
    
    return workerResults.slice(0, 3);
  } catch (error) {
    throw new Error(`Failed to get top workers: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Execute the script
async function mainWorkers() {
  try {
    const result = await getTopWorkers();
    // Output exactly as specified - JSON array with no extra formatting
    console.log(JSON.stringify(result));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

mainWorkers();
