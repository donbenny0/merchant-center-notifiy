export interface NotificationValue {
    channel: string;
    status: string;
    logs: any[];
    resourceType: string;
    recipient: string;
  }
  
  export interface NotificationResult {
    id: string;
    version: number;
    versionModifiedAt: string;
    createdAt: string;
    lastModifiedAt: string;
    lastModifiedBy: {
      clientId: string;
      isPlatformClient: boolean;
    };
    createdBy: {
      clientId: string;
      isPlatformClient: boolean;
    };
    container: string;
    key: string;
    value: NotificationValue;
  }
  
  export interface ApiResponse {
    limit: number;
    offset: number;
    count: number;
    total: number;
    results: NotificationResult[];
  }
  