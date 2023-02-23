import { TenantUserResponseDto } from '@nebulr-group/nblocks-ts-client';
import { Injectable } from '@nestjs/common';
import { NebulrAuthService } from '../nebulr-auth/nebulr-auth.service';
import { ClientService } from '../shared/client/client.service';
import { DefaultRoles } from './default-role.enum';
import { User, UserInput } from './user.graphql-model';

@Injectable()
export class UserService {
  constructor(
    private readonly nebulrAuthService: NebulrAuthService,
    private readonly clientService: ClientService
  ) { }

  async listRoles(): Promise<string[]> {
    const roles = await this.clientService.getInterceptedClient(this.nebulrAuthService.getRequest()).config.getAppRoleNames();
    return roles;
  }

  /** Lists avaiable roles that the current user are authorized to assign another user (Role Hiarchy) */
  async listAvailableRoles(): Promise<string[]> {
    const allRoles = await this.listRoles();
    const index = allRoles.findIndex(role => role === this.nebulrAuthService.getCurrentAuthContext().userRole);

    return allRoles.splice(-(allRoles.length - index));
  }

  async list(): Promise<TenantUserResponseDto[]> {
    const users = await this.clientService.getInterceptedClient(this.nebulrAuthService.getRequest()).tenant(this.nebulrAuthService.getCurrentTenantId()).users.list();
    return users;
  }

  async setGroupMembers(groupId: string, users: User[]): Promise<TenantUserResponseDto[]> {
    const oldUsers = await this.list();
    const promises: Promise<User>[] = [];

    // Clear all older users not belonging to this group anymore
    oldUsers.forEach(oldUser => {
      if (oldUser.teams.includes(groupId) && !users.some((u) => u.id == oldUser.id)) {
        const pos = oldUser.teams.findIndex((t) => t == groupId);
        oldUser.teams.splice(pos, 1);
        promises.push(this.updateUserTeams(oldUser))
      }
    });

    // Add new users
    users.forEach(user => {
      const oldUser = oldUsers.find(u => u.id === user.id);
      if (!oldUser.teams.includes(groupId)) {
        user.teams.push(groupId)
        promises.push(this.updateUserTeams(user))
      }
    });

    await Promise.all(promises);
    return this.list();
  }

  async createUsers(userNames: string[]): Promise<TenantUserResponseDto[]> {
    const promises: Promise<TenantUserResponseDto>[] = [];
    for (const userName of userNames) {
      const promise = this.clientService.getInterceptedClient(this.nebulrAuthService.getRequest()).tenant(this.nebulrAuthService.getCurrentTenantId()).users.create({
        username: userName
      });
      promises.push(promise);
    }
    return Promise.all(promises);
  }

  async sendPasswordResetLink(userId: string): Promise<boolean> {
    await this.clientService.getInterceptedClient(this.nebulrAuthService.getRequest()).tenant(this.nebulrAuthService.getCurrentTenantId()).user(userId).resetPassword();
    return true;
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      await this.clientService.getInterceptedClient(this.nebulrAuthService.getRequest()).tenant(this.nebulrAuthService.getCurrentTenantId()).user(userId).delete();
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateUser(user: UserInput): Promise<TenantUserResponseDto> {
    const authUser = this.nebulrAuthService.getCurrentAuthContext();
    if (user.role === DefaultRoles.OWNER && authUser.userRole != DefaultRoles.OWNER)
      throw Error("Logged in user must be Owner to set another user to Owner");

    const result = await this.clientService.getInterceptedClient(this.nebulrAuthService.getRequest()).tenant(this.nebulrAuthService.getCurrentTenantId()).user(user.id).update({ enabled: user.enabled, role: user.role });
    return { ...user, ...result };
  }

  private async updateUserTeams(user: User): Promise<User> {
    const result = await this.clientService.getInterceptedClient(this.nebulrAuthService.getRequest()).tenant(this.nebulrAuthService.getCurrentTenantId()).user(user.id).update({ teams: user.teams });
    return { ...user, ...result };
  }

}
