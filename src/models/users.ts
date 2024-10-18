import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity() 
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  username!: string;

  @Property()
  displayName!: string;

  static allowedFilters: Array<keyof User> = ['username', 'displayName'];

  static isValidFilter(filter: string): boolean {
    return this.allowedFilters.includes(filter as keyof User);
  }

  constructor(username: string, displayName: string) {
    this.username = username;
    this.displayName = displayName;
  }
}
