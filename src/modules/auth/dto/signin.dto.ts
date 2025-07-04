import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto{
    @IsNotEmpty()
    @IsString()
    password : string 

    @IsNotEmpty()
    @IsString()
    phone : string 
}