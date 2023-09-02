import { versionIP } from '@lib/common/constants';
import {
  IUpdateBlackListIp,
  IBlackListMember,
} from '@lib/common/interfaces/modules/blacklist';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsIP,
} from 'class-validator';

export class BlackListIpDto implements IUpdateBlackListIp {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsIP(versionIP, { each: true })
  listIp: string[];
}

export class CreateBlackListMemberDto implements IBlackListMember {
  @ApiProperty({ type: String, maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  memberId: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString()
  detail?: string | null;
}
