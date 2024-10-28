import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const current = query({
   args: {},
   handler: async (context) => {
      const userId = await getAuthUserId(context);
      if (!userId) return null;
      else return await context.db.get(userId);
   },
});
