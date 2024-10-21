import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDTO } from '../user/user.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async signup(userData: UserDTO): Promise<any> {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await this.userService.createUser({
            ...userData,
            password: hashedPassword
        });
        return { message: "signedup successful", user: newUser }
    }

    // async login(username: string, password: string): Promise<{ token: string }> {
    //     return ""
    // }
}

