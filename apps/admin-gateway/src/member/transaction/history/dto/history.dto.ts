import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional } from 'class-validator';

export class QueryFieldsHistoryDetail {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  memberId: string;
}
