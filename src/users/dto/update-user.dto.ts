import { IsEmail, IsOptional, IsString, MinLength, IsBoolean, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsBoolean()
  @IsOptional()
  nsfwEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  spoilerEnabled?: boolean;

  @IsString()
  @IsOptional()
  linkX?: string;

  @IsString()
  @IsOptional()
  linkGithub?: string;

  @IsString()
  @IsOptional()
  linkWebsite?: string;

  @IsString()
  @IsOptional()
  linkInstagram?: string;
}
