import { Controller, Post, Body, UnauthorizedException, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'User Login', description: 'Authenticates a user and returns a JWT token.' })
    @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } } })
    @ApiResponse({ status: 200, description: 'Login successful, returns token.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    async login(@Body() body: any) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }

    @Post('register')
    @ApiOperation({ summary: 'User Registration', description: 'Registers a new user and tenant.' })
    @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' }, name: { type: 'string' }, businessName: { type: 'string' } } } })
    @ApiResponse({ status: 201, description: 'Registration successful.' })
    async register(@Body() body: any) {
        try {
            const result = await this.authService.register(body);
            return result;
        } catch (error) {
            throw new HttpException({
                statusCode: 500,
                message: error.message || 'Registration failed',
                error: error.stack,
            }, 500);
        }
    }
}
