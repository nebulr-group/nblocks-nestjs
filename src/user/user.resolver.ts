import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MeInput, User, UserInput } from './user.graphql-model';
import { UserService } from './user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query((returns) => [String], {
    description:
      'List all available user roles that the current user can assign others',
  })
  async listUserRoles(): Promise<string[]> {
    return this.userService.listAvailableRoles();
  }

  @Query((returns) => User, {
    description: 'Get current user',
  })
  async getMe(): Promise<User> {
    const result = await this.userService.getMe();
    return result;
  }

  @Query((returns) => [User], {
    description: 'List all users in this tenant.',
  })
  async listUsers(): Promise<User[]> {
    return this.userService.list();
  }

  @Mutation((returns) => [User], {
    description: 'This will create a new user for a tenant.',
  })
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

  @Mutation((returns) => Boolean)
  async deleteUser(
    @Args({ name: 'userId', type: () => String }) userId: string,
  ): Promise<boolean> {
    return this.userService.deleteUser(userId);
  }

  @Mutation((returns) => User, {
    description:
      'Update the user. You can change role, teams and also enable or disable the user from logging in.',
  })
  async updateUser(
    @Args({ name: 'user', type: () => UserInput }) user: UserInput,
  ): Promise<User> {
    return this.userService.updateUser(user);
  }

  @Mutation((returns) => User, {
    description: 'Update current user',
  })
  async updateMe(
    @Args({ name: 'user', type: () => MeInput }) user: MeInput,
  ): Promise<User> {
    const result = await this.userService.updateMe(user);
    return result;
  }

  @Mutation((returns) => Boolean)
  async sendPasswordResetLink(
    @Args({ name: 'userId', type: () => String }) userId: string,
  ): Promise<boolean> {
    return this.userService.sendPasswordResetLink(userId);
  }
}
