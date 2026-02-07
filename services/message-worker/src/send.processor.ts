import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { MetaClient } from './meta.client';

@Processor('send-message')
export class SendMessageProcessor {
    private meta = new MetaClient();

    @Process()
    async handle(job: Job) {
        const {
            tenantId,
            phoneNumberId,
            accessToken,
            message,
        } = job.data;

        try {
            const response = await this.meta.sendMessage(
                phoneNumberId,
                accessToken,
                message,
            );

            return {
                success: true,
                metaMessageId: response.data.messages?.[0]?.id,
            };
        } catch (err: any) {
            const status = err.response?.status;

            // Retry only safe errors
            if (status >= 500 || status === 429) {
                throw err; // BullMQ retry
            }

            // Permanent failure → DLQ
            return {
                success: false,
                error: err.response?.data,
            };
        }
    }
}
