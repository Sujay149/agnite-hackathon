export interface SafetyAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface IncidentReport {
  id: string;
  title: string;
  description: string;
  reportedBy: string;
  createdAt: Date;
  status: 'open' | 'in_progress' | 'resolved';
}

export interface SafetyDashboardData {
  totalIncidents: number;
  activeAlerts: number;
  resolvedIncidents: number;
  incidentReports: IncidentReport[];
  safetyAlerts: SafetyAlert[];
}