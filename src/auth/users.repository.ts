import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import { AccessLevel } from "./users-accesslevel.enum";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { email, password } = authCredentialsDto;
    
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(password, salt);

        const user = this.create({email, password: hashedPass, accessLevel: AccessLevel.USER});
        try {
            await this.save(user);
        } catch (error) {
            if (error.code === '23505') { // duplicate email
                throw new ConflictException(`user with email ${email} already exists`);
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

}
