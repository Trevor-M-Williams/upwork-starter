"use server";

import { db } from "@/server/db";
import { dashboards as dashboardsSchema } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { getUser } from "@/server/server-only/auth";
import { Dashboard } from "@/types";

export const getDashboards = async () => {
  const user = await getUser();
  if (!user) {
    return [];
  }

  const data = await db.query.dashboards.findMany({
    where: eq(dashboardsSchema.userId, user.id),
    columns: {
      id: true,
      createdAt: true,
    },
    with: {
      company: {
        columns: {
          id: true,
          name: true,
          ticker: true,
        },
      },
    },
  });

  const dashboards = data
    .map(({ company, createdAt, id }) =>
      company
        ? {
            id,
            companyId: company.id,
            name: company.name,
            ticker: company.ticker,
            createdAt,
          }
        : null,
    )
    .filter((dashboard): dashboard is Dashboard => dashboard !== null);

  return dashboards;
};

export const getDashboardByDashboardId = async (dashboardId: string) => {
  const user = await getUser();
  if (!user) {
    return null;
  }

  return await db.query.dashboards.findFirst({
    where: and(
      eq(dashboardsSchema.userId, user.id),
      eq(dashboardsSchema.id, dashboardId),
    ),
  });
};

export const createDashboard = async (companyId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      return { error: true, message: "User not found" };
    }

    await db.insert(dashboardsSchema).values({ userId: user.id, companyId });
    return { error: false, message: "Dashboard created" };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to create dashboard" };
  }
};

export const deleteDashboard = async (dashboardId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      return { error: true, message: "User not found" };
    }

    await db
      .delete(dashboardsSchema)
      .where(
        and(
          eq(dashboardsSchema.userId, user.id),
          eq(dashboardsSchema.id, dashboardId),
        ),
      );
    return { error: false, message: "Dashboard deleted" };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to delete dashboard" };
  }
};
