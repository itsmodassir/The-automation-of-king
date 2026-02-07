import { IsString, IsEmail, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateTenantDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    domain: string; // Subdomain part

    @IsString()
    @IsOptional()
    customDomain?: string;

    @IsBoolean()
    @IsOptional()
    aiEnabled?: boolean;
}
