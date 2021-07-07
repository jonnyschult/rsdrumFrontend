import { Assignment, Comment, User } from './';

export class Lesson {
  constructor(
    public lessonNumber: number,
    public lessonLevel: number,
    public title: string,
    public description: string,
    public coverImg: string,
    public assignments: Assignment[],
    public students: User[],
    public comments: Comment[],
    public id?: string
  ) {}
}
