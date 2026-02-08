import { AutomationService } from './automation.service';
export declare class AutomationController {
    private service;
    constructor(service: AutomationService);
    getSettings(req: any): Promise<{
        enabled: boolean;
        confidence: number;
    }>;
    updateSettings(dto: any, req: any): Promise<import("typeorm").UpdateResult>;
}
