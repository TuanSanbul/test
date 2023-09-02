import { MemoNote } from '@lib/core/databases/postgres';

export interface IMemoNote extends Omit<MemoNote, 'member'> {
  member: string;
}
