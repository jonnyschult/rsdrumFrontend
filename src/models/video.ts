export class Video {
  constructor(
    public videoUrl: string,
    public title: string,
    public description: string,
    public tags: string[],
    public instructional: boolean,
    public id?: string
  ) {}
}
