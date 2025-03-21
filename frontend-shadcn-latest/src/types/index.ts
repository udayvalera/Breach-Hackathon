export interface BorrowerProfile {
  id: string;
  name: string;
  unifiedScore: number;
  equifaxScore?: number;
  experianScore?: number;
  transunionScore?: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  confidenceScore: number;
  lastUpdated: string;
  status?: 'Approved' | 'Denied' | 'Pending';
}

export interface Bureau {
  name: 'Equifax' | 'Experian' | 'TransUnion';
  status: 'Online' | 'Offline';
  uptime: number;
  lastUpdated?: string;
}