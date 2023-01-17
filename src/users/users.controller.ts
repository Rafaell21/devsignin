import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { SigninDto } from './dto/signin.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    public async signup(@Body() signupDtop: SignupDto): Promise < User > {
        return this.userService.signup(signupDtop)
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    public async signIN(@Body() signinDtop: SigninDto): Promise < {
        name: string;jwtToken: string;email: string
    } > {
        return this.userService.signin(signinDtop)
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    public async findAll(): Promise <User[]> {
        return this.userService.findAll();
    }


}

