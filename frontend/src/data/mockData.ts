import { BorrowerProfile, Bureau } from '../types';

export const mockBorrowers: BorrowerProfile[] = [
  {
    id: 'B001',
    name: 'John Smith',
    unifiedScore: 725,
    equifaxScore: 710,
    experianScore: 730,
    transunionScore: 735,
    riskLevel: 'Low',
    confidenceScore: 95,
    lastUpdated: '2025-03-21T10:30:00',
    status: 'Approved'
  },
  {
    id: 'B002',
    name: 'Sarah Johnson',
    unifiedScore: 650,
    equifaxScore: 645,
    experianScore: 660,
    transunionScore: 645,
    riskLevel: 'Moderate',
    confidenceScore: 90,
    lastUpdated: '2025-03-21T09:15:00',
    status: 'Pending'
  },
  {
    id: 'B003',
    name: 'Michael Brown',
    unifiedScore: 550,
    equifaxScore: 540,
    experianScore: undefined,
    transunionScore: 560,
    riskLevel: 'High',
    confidenceScore: 85,
    lastUpdated: '2025-03-21T08:45:00',
    status: 'Denied'
  }
];

export const bureauStatus: Bureau[] = [
  {
    name: 'Equifax',
    status: 'Online',
    uptime: 100,
    lastUpdated: '2025-03-21T10:30:00'
  },
  {
    name: 'Experian',
    status: 'Offline',
    uptime: 98,
    lastUpdated: '2025-03-21T09:45:00'
  },
  {
    name: 'TransUnion',
    status: 'Online',
    uptime: 95,
    lastUpdated: '2025-03-21T10:30:00'
  }
];