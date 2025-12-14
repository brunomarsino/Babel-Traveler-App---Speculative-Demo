export enum Screen {
  HERE = 'HERE',
  PORTALS = 'PORTALS',
  NETWORK = 'NETWORK',
  SYSTEM = 'SYSTEM',
  // Sub-screens
  JUMP_DETAILS = 'JUMP_DETAILS',
  AUTOMATIONS = 'AUTOMATIONS',
  HISTORY = 'HISTORY',
  SPACE_DETAILS = 'SPACE_DETAILS',
}

export enum JourneyPhase {
  IDLE = 'IDLE',
  PRE_STATION = 'PRE_STATION', // Transit to station
  STATION_MODE = 'STATION_MODE', // At the gate/security
  IN_TRANSIT = 'IN_TRANSIT', // The actual jump
  ARRIVAL_MODE = 'ARRIVAL_MODE', // Post-jump decompression
}

export enum RiskMode {
  STRICT = 'STRICT', // Domestic only, verified routes, extra confirmation
  STANDARD = 'STANDARD', // Normal operation
  OPEN = 'OPEN', // Developer/Emergency mode, high friction warnings
}

export interface Identity {
  id: string;
  type: 'PERSONAL' | 'CORPORATE' | 'DIPLOMATIC';
  name: string;
  clearanceLevel: number;
  jurisdiction: string;
  isDefault: boolean;
}

export interface Portal {
  id: string;
  name: string;
  type: 'PUBLIC' | 'PRIVATE' | 'COMMERCIAL';
  status: 'ONLINE' | 'MAINTENANCE' | 'BUSY' | 'LOCKED';
  waitTimeMin: number;
  distanceKm: number;
  image: string;
  coordinates: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Route {
  id: string;
  originStation: Portal;
  destStation: Portal;
  transitTimeMin: number;
  complianceCheck: 'CLEARED' | 'VISA_REQ' | 'RESTRICTED';
  totalDurationMin: number;
}

export interface JumpPass {
  id: string;
  route: Route;
  identityUsed: Identity;
  status: 'SCHEDULED' | 'READY_TO_BOARD' | 'COMPLETED' | 'CANCELLED';
  gate: string;
  boardingTime: string;
  qrCode: string;
}

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  isActive: boolean;
}

export interface Contact {
  id: string;
  name: string;
  relation: string;
  accessLevel: 'FULL' | 'GUEST' | 'NONE';
  avatar: string;
}

export interface Space {
  id: string;
  name: string;
  type: 'HOME' | 'OFFICE' | 'STUDIO' | 'LAB';
  accessCount: number;
  icon: string;
  securityLevel: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  result: 'ALLOWED' | 'DENIED';
}