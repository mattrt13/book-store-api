import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
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

    @Put('/:id')
    async updateUser(@Param('id') id: number, @Body() user: Partial<UserDTO>): Promise<UserDTO> {
        return this.userService.updateUser(id, user);
    }

    @Delete('/:id')
    async deleteUser(@Param('id') id: number): Promise<void> {
        return this.userService.deleteUser(id);
    }
}
