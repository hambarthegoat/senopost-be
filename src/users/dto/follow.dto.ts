import { IsNotEmpty, IsString } from 'class-validator';

export class FollowDto {
  @IsString()
  @IsNotEmpty()
  communityId: string;
}
