import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User, UserInput } from './user.graphql-model';
import { UserService } from './user.service';

@Resolver(of => User)
export class UserResolver {
  constructor(private userService: UserService) { }

  @Query(returns => [User])
  async listUsers(): Promise<User[]> {
    return this.userService.list();
  }

  @Mutation(returns => [User])
  async createUsers(
    @Args({ name: 'userNames', type: () => [String] }) userNames: string[],
  ): Promise<User[]> {
    return this.userService.createUsers(userNames);
  }

  // @Mutation(returns => [User])
  // async addUsersToGroup(
  //   @Args({ name: 'group', type: () => Group }) group: Group,
  //   @Args({ name: 'users', type: () => [User] }) users: User[],
  // ): Promise<User[]> {
  //   return this.userService.setGroupMembers(group.id.toString(), users);
  // }

  @Mutation(returns => Boolean)
  async deleteUser(
    @Args({ name: 'userId', type: () => String }) userId: string,
  ): Promise<boolean> {
    return this.userService.deleteUser(userId);
  }

  @Mutation(returns => User)
  async updateUser(
    @Args({ name: 'user', type: () => UserInput }) user: UserInput,
  ): Promise<User> {
    return this.userService.updateUser(user);
  }

  @Mutation(returns => Boolean)
  async sendPasswordResetLink(
    @Args({ name: 'userId', type: () => String }) userId: string,
  ): Promise<boolean> {
    return this.userService.sendPasswordResetLink(userId);
  }
}
