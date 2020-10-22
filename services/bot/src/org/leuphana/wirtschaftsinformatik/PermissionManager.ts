import { GuildMember } from "discord.js";
import { Permission } from "./Permission";

export class PermissionManager {

    private static instance: PermissionManager;

    public static getInstance(): PermissionManager {
        if(PermissionManager.instance == null) {
            PermissionManager.instance = new PermissionManager();
        }

        return PermissionManager.instance;
    }

    public checkPermission(permission: Permission, member: GuildMember): boolean {
        return member.permissions.has("ADMINISTRATOR");
    }
}
