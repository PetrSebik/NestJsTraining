import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor (
        private authServise: AuthService
    ) {}

    @Post('/signup')
    @ApiResponse({status: 201})
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authServise.signUp(authCredentialsDto);
    }

    @Post('/signin')
    @ApiResponse({status: 201})
    signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        return this.authServise.signIn(authCredentialsDto);
    }
}
