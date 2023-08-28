import { ServiceName } from '@lib/common/enums';
import { IMessage, IMutationResponse } from '@lib/common/interfaces';
import { IMemoNote } from '@lib/common/interfaces/modules/member';
import { ResponseResult } from '@lib/common/types';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NoteService } from './note.service';

@Controller()
export class NoteController {
  static prefixCmd = [ServiceName.MEMBER_SERVICE, NoteController.name];
  constructor(private readonly noteService: NoteService) {}

  @MessagePattern({
    cmd: getPattern(
      NoteController.prefixCmd,
      NoteController.prototype.createNote.name,
    ),
  })
  createNote(
    message: IMessage<IMemoNote>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.noteService.createNote(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      NoteController.prefixCmd,
      NoteController.prototype.deleteNote.name,
    ),
  })
  deleteNote(
    message: IMessage<{ ids: string[] }>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { ids } = message.payload;
    return this.noteService.deleteNote(ids);
  }
}
