import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bacrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') 
        private readonly userModel: Model < User > ,
        private readonly authService: AuthService,
    ) {}

    public async signup(signupDto: SignupDto ): Promise<User>{
        const user = new this.userModel(signupDto);

        return user.save();

    }

    public async signin(signinDto: SigninDto ): Promise<{name: string; jwtToken:string; email:string}>{
        const user = await this.findByEmail(signinDto.email)
        const match = await this.checkPassword(signinDto.password, user)

        if(!match){
            throw new NotFoundException('Invalid credentials')
        }

        const jwtToken = await this.authService.createAccessToken(user._id)

        return {name: user.name, jwtToken, email:user.email};

    }

    public async findAll(): Promise<User[]> {
        return this.userModel.find()
    }

    private async findByEmail(email: string): Promise<User>{
        const user = await this.userModel.findOne( {email} );

        if(!user){
            throw new NotFoundException('Email not found')
        }

        return user;

    }

    private async checkPassword(password: string, user: User): Promise<boolean>{
        const match = await bacrypt.compare(password, user.password)

        if(!match){
            throw new NotFoundException('Password not found')
        }

        return match;

    }
}
