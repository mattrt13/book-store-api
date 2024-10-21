Yes! In a modular monolith architecture, having a separate module for authentication is recommended to maintain clear separation of concerns. Here’s how you can adapt the code for a modular monolith structure.

1. Create AuthModule
In a modular monolith, each module manages its own domain logic. Create an auth directory with the following structure:

arduino
Copy code
/src
│
├── auth
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│
└── user
    ├── user.module.ts
    ├── user.service.ts
    └── user.dto.ts
2. Auth Module (auth.module.ts)
typescript
Copy code
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule, // Auth depends on UserModule
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret', // Use env var for production
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
3. Auth Service (auth.service.ts)
typescript
Copy code
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDTO } from '../user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(userData: UserDTO): Promise<any> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await this.userService.createUser({
      ...userData,
      password: hashedPassword,
    });
    return { message: 'Signup successful', user: newUser };
  }

  async login(username: string, password: string): Promise<{ token: string }> {
    const user = await this.userService.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user.id };
    return { token: this.jwtService.sign(payload) };
  }
}
4. Auth Controller (auth.controller.ts)
typescript
Copy code
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserDTO } from '../user/user.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() userData: UserDTO) {
    return this.authService.signup(userData);
  }

  @Post('/login')
  async login(@Body() { username, password }: { username: string; password: string }) {
    return this.authService.login(username, password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
5. JWT Strategy (jwt.strategy.ts)
typescript
Copy code
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'default_secret',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
6. User Module (user.module.ts)
typescript
Copy code
import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  exports: [UserService], // Export so AuthModule can use it
})
export class UserModule {}
7. Update AppModule to Import AuthModule
typescript
Copy code
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule],
})
export class AppModule {}
8. Environment Configuration (Optional)
Use environment variables for the JWT secret:

bash
Copy code
JWT_SECRET=your-secret-key
9. Testing Endpoints
Signup:
POST /api/auth/signup

json
Copy code
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
Login:
POST /api/auth/login

json
Copy code
{
  "username": "john",
  "password": "password123"
}
Access Profile (Protected):
POST /api/auth/profile
Include the JWT token in the Authorization header:

makefile
Copy code
Authorization: Bearer <your-jwt-token>
10. Conclusion
In your modular monolith structure:

The AuthModule is responsible for authentication and token management.
The UserModule provides user data management and is reused by AuthModule.
This separation keeps your code clean and scalable.
This structure aligns well with your architecture and ensures proper encapsulation of logic. Let me know if you need more help!