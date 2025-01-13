import { pollCommits } from "~/lib/github";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const project = await ctx.db.project.create({
          data: {
            name: input.name,
            githubUrl: input.githubUrl,
            userToProjects: {
              create: {
                userId: ctx.user.userId!,
              },
            },
          },
        });

        console.log("Project created, polling commits for:", project.id);
        // Poll commits after project creation
        await pollCommits(project.id);
        return project;
      } catch (error) {
        console.error("Error creating project or polling commits:", error);
        throw new Error("Failed to create project or fetch commits.");
      }
    }),

  getProjects: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.project.findMany({
        where: {
          userToProjects: {
            some: {
              userId: ctx.user.userId!,
            },
          },
          deletedAt: null,
        },
      });
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw new Error("Failed to fetch projects.");
    }
  }),

  getCommits: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.commit.findMany({
          where: {
            projectId: input.projectId,
          },
        });
      } catch (error) {
        console.error("Error fetching commits:", error);
        throw new Error("Failed to fetch commits.");
      }
    }),
});
