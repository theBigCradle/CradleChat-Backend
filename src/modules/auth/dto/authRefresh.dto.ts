import { IsNotEmpty, IsString } from "class-validator";

export class AuthRefreshDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
