import { ICreateWithdrawal } from '@lib/common/interfaces/modules/withdrawal';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDivisibleBy,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateWithdrawalDto implements Partial<ICreateWithdrawal> {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  memberId: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Amount must be greater than 0' })
  @IsDivisibleBy(10000, { message: 'Amount must be a multiple of 10000' })
  amount: number;
}
