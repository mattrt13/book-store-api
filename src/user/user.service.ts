import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './user.dto';
import { BookDTO } from 'src/book/book.dto';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async getAll(): Promise<UserDTO[]> {
        const users = await this.userRepository.find();
        return users.map(user => this.toDTO(user))
    }

    async createUser(userData: UserDTO): Promise<User> {
        var available = await this.userRepository.find({
            where: [
                { username: userData.username, password: userData.password }
            ]
        });

        if (available.length > 0) {
            return available[0];
        }

        let result = this.userRepository.create({
            username: userData.username,
            password: userData.password,
            email: userData.email
        })

        return this.userRepository.save(result);
    }

    async updateUser(id: number, newUserData: Partial<UserDTO>): Promise<User> {
        const currentUser = await this.userRepository.findOneBy({ id });
        if (!currentUser)
            throw new Error("user not found");
        const updatedUser = this.updateUserData(currentUser, newUserData);
        return updatedUser;
    }

    async deleteUser(id: number): Promise<void> {
        const currentUser = await this.userRepository.findOneBy({ id });
        if (!currentUser)
            throw new Error("user not found");
        await this.userRepository.delete(currentUser);
    }

    private updateUserData(user: User, userData: Partial<UserDTO>): User {
        user.username = userData.username;
        user.password = userData.password;
        user.email = userData.email;
        return user;
    }

    private toDTO(user: User): UserDTO {
        return {
            username: user.username,
            password: user.password,
            email: user.email,
        }
    }
}
