import { Guid } from 'guid-typescript';
export class Todo {
  constructor(
    public id: Guid,
    public group: string,
    public title: string,
    public description: string,
    public link: string,
    public isComplete: boolean)
  {

  }
}
