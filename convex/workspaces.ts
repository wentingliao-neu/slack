import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
   args: {
      name: v.string(),
   },
   handler: async (context, args) => {
      const userId = await getAuthUserId(context);
      if (!userId) throw new Error("Unauthorized");

      const joinCode = "123456";
      const workspaceId = await context.db.insert("workspaces", {
         name: args.name,
         userId,
         joinCode,
      });

      return workspaceId;
   },
});

export const get = query({
   args: {},
   handler: async (context) => {
      return await context.db.query("workspaces").collect();
   },
});

export const getById = query({
   args: {
      id: v.id("workspaces"),
   },
   handler: async (context, args) => {
      const userId = await getAuthUserId(context);
      if (!userId) throw new Error("Unauthorized");
      return await context.db.get(args.id);
   },
});
