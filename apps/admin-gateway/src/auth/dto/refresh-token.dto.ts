import { IRefreshTokenPayload } from '@lib/common/interfaces/modules/auth';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto
  implements Pick<IRefreshTokenPayload, 'refreshToken'>
{
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
