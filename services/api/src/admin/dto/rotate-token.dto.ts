export class RotateTokenDto {
    systemUserId!: string;
    encryptedToken!: string;
    scopes!: string[];
    expiresAt!: Date;
}
