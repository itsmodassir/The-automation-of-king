import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analytics;
    constructor(analytics: AnalyticsService);
    getOverview(req: any): Promise<{
        whatsappNumber: string;
        messagesSent: number;
        aiCreditsUsed: number;
        openConversations: number;
    }>;
}
