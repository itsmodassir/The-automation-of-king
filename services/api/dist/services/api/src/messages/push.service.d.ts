export declare class PushNotificationService {
    private readonly logger;
    send(dto: {
        token: string;
        title: string;
        body: string;
        data?: any;
    }): Promise<{
        success: boolean;
        messageId: string;
    }>;
}
