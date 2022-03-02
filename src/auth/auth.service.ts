import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor( 
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        private jwtServise: JwtService,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.usersRepository.createUser(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { email, password } = authCredentialsDto;
        const user = await this.usersRepository.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { email: email, accessLevel: user.accessLevel }
            const accessToken: string = await this.jwtServise.sign(payload)
            return { accessToken };
        } else {
            throw new UnauthorizedException('please check your login credentials');
        }
    }
}
