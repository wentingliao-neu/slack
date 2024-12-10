import { v } from "convex/values";
import { query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

function populateUser(context: QueryCtx, userId: Id<"users">) {
   return context.db.get(userId);
}

export const current = query({
   args: { workspaceId: v.id("workspaces") },
   handler: async (context, args) => {
      const userId = await getAuthUserId(context);
      if (!userId) return null;

      const member = await context.db
         .query("members")
         .withIndex("by_workspace_id_user_id", (q) =>
            q.eq("workspaceId", args.workspaceId).eq("userId", userId)
         )
         .unique();

      return member || null;
   },
});

export const get = query({
   args: { workspaceId: v.id("workspaces") },
   handler: async (context, args) => {
      const userId = await getAuthUserId(context);
      if (!userId) return [];

      const member = await context.db
         .query("members")
         .withIndex("by_workspace_id_user_id", (q) =>
            q.eq("workspaceId", args.workspaceId).eq("userId", userId)
         )
         .unique();

      if (!member) return [];

      const data = await context.db
         .query("members")
         .withIndex("by_workspace_id", (q) =>
            q.eq("workspaceId", args.workspaceId)
         )
         .collect();

      // const members = await Promise.all(
      //    data.map((m) => populateUser(context, m.userId))
      // );

      const members = [];
      for (const m of data) {
         const user = await populateUser(context, m.userId);
         if (user) members.push({ ...m, user });
      }
      return members;
   },
});
