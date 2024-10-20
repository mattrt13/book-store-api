import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';

@Controller('/api/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getAll(): Promise<UserDTO[]> {
        return this.userService.getAll();
    }

    @Post()
    @HttpCode(201)
    async createUser(@Body() userData: UserDTO): Promise<UserDTO> {
        return this.userService.createUser(userData);
    }
}
