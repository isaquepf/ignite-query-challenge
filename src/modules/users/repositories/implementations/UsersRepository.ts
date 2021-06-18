import { getRepository, MoreThan, Not, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User | undefined> {
    const user = await this.repository.findOne(user_id, {relations: ["games"]});

    if (!user) {
      throw new Error("User does not exist!");
    }

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("Select * From Users order by first_name asc"); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {  
    const users = await this.repository.createQueryBuilder("users")
      .where("LOWER(first_name) = LOWER(:first_name)", { first_name })
      .andWhere("LOWER(last_name) = LOWER(:last_name)", { last_name })
      .getMany();

    return users;
  }
}
