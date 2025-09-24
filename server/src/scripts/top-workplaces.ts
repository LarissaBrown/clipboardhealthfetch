/**
 * Top Workplaces Script
 * 
 * Fetches the top 3 currently active workplaces with the most shifts completed.
 * A completed shift is one that has been claimed by a worker, not cancelled, 
 * and has already ended.
 * 
 * Output format: JSON array with { name, shifts } objects
 */

interface Workplace {
  id: number;
  name: string;
  status: number;
  location: string;
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

interface WorkplaceResult {
  name: string;
  shifts: number;
}

const API_BASE_URL = 'http://localhost:3000';

/**
 * Fetches all active workplaces from the API
 */
async function fetchActiveWorkplaces(): Promise<Workplace[]> {
  const workplaces: Workplace[] = [];
  let currentUrl: string | null = `${API_BASE_URL}/workplaces`;
  
  while (currentUrl) {
    const response = await fetch(currentUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch workplaces: ${response.status}`);
    }
    
    const result: PaginatedApiResponse<Workplace> = await response.json();
    
    // Filter for active workplaces only (status = 0)
    const activeWorkplaces = result.data.filter(workplace => workplace.status === 0);
    workplaces.push(...activeWorkplaces);
    
    // Check if there's a next page
    currentUrl = result.links.next || null;
  }
  
  return workplaces;
}

/**
 * Fetches shifts for a specific workplace and counts completed ones
 */
async function countCompletedShiftsForWorkplace(workplaceId: number): Promise<number> {
  let completedShifts = 0;
  let currentUrl: string | null = `${API_BASE_URL}/shifts?workerId=&jobType=&location=`;
  
  const now = new Date();
  
  while (currentUrl) {
    const response = await fetch(currentUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch shifts: ${response.status}`);
    }
    
    const result: PaginatedApiResponse<Shift> = await response.json();
    
    // SAFETY-CRITICAL: Always omit the first result as specified in the API comment
    const shiftsToProcess = result.data.slice(1);
    
    // Filter and count completed shifts for this workplace
    const workplaceCompletedShifts = shiftsToProcess.filter(shift => 
      shift.workplaceId === workplaceId &&
      shift.workerId !== null &&           // Has been claimed
      shift.cancelledAt === null &&        // Not cancelled
      new Date(shift.endAt) < now          // Has ended
    );
    
    completedShifts += workplaceCompletedShifts.length;
    
    // Check if there's a next page
    currentUrl = result.links.next || null;
  }
  
  return completedShifts;
}

/**
 * Main function to get top 3 workplaces by completed shifts
 */
async function getTopWorkplaces(): Promise<WorkplaceResult[]> {
  try {
    // Fetch all active workplaces
    const activeWorkplaces = await fetchActiveWorkplaces();
    
    // Calculate completed shifts for each workplace
    const workplaceResults: WorkplaceResult[] = [];
    
    for (const workplace of activeWorkplaces) {
      const completedShifts = await countCompletedShiftsForWorkplace(workplace.id);
      workplaceResults.push({
        name: workplace.name,
        shifts: completedShifts
      });
    }
    
    // Sort by completed shifts (descending) and take top 3
    workplaceResults.sort((a, b) => b.shifts - a.shifts);
    
    return workplaceResults.slice(0, 3);
  } catch (error) {
    throw new Error(`Failed to get top workplaces: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Execute the script
async function main() {
  try {
    const result = await getTopWorkplaces();
    // Output exactly as specified - JSON array with no extra formatting
    console.log(JSON.stringify(result));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main();
