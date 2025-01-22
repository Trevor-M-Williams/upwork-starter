"use server";

import { db } from "@/server/db";
import { dashboards as dashboardsSchema } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { getUser } from "@/server/server-only/auth";
import { Dashboard } from "@/types";
import { createCompany } from "./companies";

export const getDashboards = async () => {
  const user = await getUser();
  if (!user) {
    return [];
  }

  const data = await db.query.dashboards.findMany({
    where: eq(dashboardsSchema.userId, user.id),
    columns: {
      id: true,
      userId: true,
      companyId: true,
      createdAt: true,
    },
    with: {
      company: true,
    },
  });

  const dashboards = data
    .map((dashboard) =>
      dashboard.company
        ? {
            id: dashboard.id,
            userId: dashboard.userId,
            companyId: dashboard.companyId,
            company: dashboard.company,
            createdAt: dashboard.createdAt,
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

  console.log("dashboardId", dashboardId);

  return await db.query.dashboards.findFirst({
    where: and(
      eq(dashboardsSchema.userId, user.id),
      eq(dashboardsSchema.id, dashboardId),
    ),
  });
};

export const createDashboard = async (ticker: string) => {
  try {
    const user = await getUser();
    if (!user) {
      return { error: true, message: "User not found" };
    }
    const { id: companyId, error, message } = await createCompany(ticker);
    if (error || !companyId) {
      return { error: true, message };
    }

    const [inserted] = await db
      .insert(dashboardsSchema)
      .values({ userId: user.id, companyId })
      .returning({ id: dashboardsSchema.id });
    return { error: false, message: "Dashboard created", id: inserted.id };
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
