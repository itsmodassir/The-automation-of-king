import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SendMessageDto {
    @IsString()
    @IsNotEmpty()
    to!: string;

    @IsString()
    @IsNotEmpty()
    text!: string;

    @IsString()
    @IsNotEmpty()
    phoneNumberId!: string;

    @IsString()
    @IsNotEmpty()
    accessToken!: string;

    @IsString()
    @IsOptional()
    clientMessageId?: string;
}
