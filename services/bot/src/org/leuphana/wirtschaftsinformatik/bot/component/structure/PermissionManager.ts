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

        let state;

        switch (permission) {
            case Permission.REACTIONROLE_DELETE:
            case Permission.REACTIONROLE_CREATE:
            case Permission.RSSFEED_ADD:
            case Permission.RSSFEED_REMOVE:
            case Permission.RSSFEED_LIST:
                state = member.permissions.has("ADMINISTRATOR");
                break;
            default:
                state = true;
                break;
        }

        return state;
    }
}
