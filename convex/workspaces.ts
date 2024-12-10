import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

function generateCode() {
   const code = Array.from(
      { length: 6 },
      () =>
         "1234567890qwertyuiopasdfghjklzxcvbnm"[Math.floor(Math.random() * 36)]
   ).join("");
   return code;
}

export const create = mutation({
   args: {
      name: v.string(),
   },
   handler: async (context, args) => {
      const userId = await getAuthUserId(context);
      if (!userId) throw new Error("Unauthorized");

      const joinCode = generateCode();
      const workspaceId = await context.db.insert("workspaces", {
         name: args.name,
         userId,
         joinCode,
      });

      await context.db.insert("members", {
         userId,
         workspaceId,
         role: "admin",
      });
      await context.db.insert("channels", {
         name: "general",
         workspaceId,
      });
      return workspaceId;
   },
});

export const get = query({
   args: {},
   handler: async (context) => {
      const userId = await getAuthUserId(context);
      if (!userId) return [];

      const members = await context.db
         .query("members")
         .withIndex("by_user_id", (q) => q.eq("userId", userId))
         .collect();
      const workspaceIds = members.map((m) => m.workspaceId);
      const workspaces = [];
      for (const workspaceId of workspaceIds) {
         const workspace = await context.db.get(workspaceId);
         if (workspace) workspaces.push(workspace);
      }
      return workspaces;
   },
});

export const getById = query({
   args: {
      id: v.id("workspaces"),
   },
   handler: async (context, args) => {
      const userId = await getAuthUserId(context);
      if (!userId) throw new Error("Unauthorized");
      const member = await context.db
         .query("members")
         .withIndex("by_workspace_id_user_id", (q) =>
            q.eq("workspaceId", args.id).eq("userId", userId)
         )
         .unique();
      if (!member) return null;
      return await context.db.get(args.id);
   },
});

export const update = mutation({
   args: {
      id: v.id("workspaces"),
      name: v.string(),
   },
   handler: async (context, args) => {
      const userId = await getAuthUserId(context);
      if (!userId) throw new Error("Unauthorized");
      const member = await context.db
         .query("members")
         .withIndex("by_workspace_id_user_id", (q) =>
            q.eq("workspaceId", args.id).eq("userId", userId)
         )
         .unique();
      if (!member || member.role !== "admin") throw new Error("Unauthorized");
      await context.db.patch(args.id, { name: args.name });
      return args.id;
   },
});

export const remove = mutation({
   args: {
      id: v.id("workspaces"),
      name: v.string(),
   },
   handler: async (context, args) => {
      const userId = await getAuthUserId(context);
      if (!userId) throw new Error("Unauthorized");
      const member = await context.db
         .query("members")
         .withIndex("by_workspace_id_user_id", (q) =>
            q.eq("workspaceId", args.id).eq("userId", userId)
         )
         .unique();
      if (!member || member.role !== "admin") throw new Error("Unauthorized");
      const [members] = await Promise.all([
         context.db
            .query("members")
            .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
            .collect(),
      ]);
      for (const m of members) await context.db.delete(m._id);

      await context.db.delete(args.id);
      return args.id;
   },
});
