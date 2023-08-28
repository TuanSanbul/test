import { EConnStatusTab } from '@lib/common/enums';
import { IConnStatusMessage } from '@lib/common/interfaces/modules/connection-status';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class ConnStatusDto implements Partial<IConnStatusMessage> {
  @ApiProperty({
    type: String,
    example: EConnStatusTab.Default,
    enum: EConnStatusTab,
  })
  @IsEnum(EConnStatusTab)
  tab: EConnStatusTab;
}
