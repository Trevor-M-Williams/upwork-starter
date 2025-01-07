"use server";

import { db } from "@/server/db";
import { userCompanies } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { getUser } from "@/server/server-only/auth";
import { UserCompany } from "@/types";

export const getUserCompanies = async () => {
  const user = await getUser();
  if (!user) {
    return [];
  }

  const data = await db.query.userCompanies.findMany({
    where: eq(userCompanies.userId, user.id),
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

  const companies = data
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
    .filter((company): company is UserCompany => company !== null);

  return companies;
};

export const getUserCompanyByDashboardId = async (dashboardId: string) => {
  const user = await getUser();
  if (!user) {
    return null;
  }

  return await db.query.userCompanies.findFirst({
    where: and(
      eq(userCompanies.userId, user.id),
      eq(userCompanies.id, dashboardId),
    ),
  });
};

export const createUserCompany = async (companyId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      return { error: true, message: "User not found" };
    }

    await db.insert(userCompanies).values({ userId: user.id, companyId });
    return { error: false, message: "Company created" };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to create company" };
  }
};

export const deleteUserCompany = async (companyId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      return { error: true, message: "User not found" };
    }

    await db
      .delete(userCompanies)
      .where(
        and(
          eq(userCompanies.userId, user.id),
          eq(userCompanies.companyId, companyId),
        ),
      );
    return { error: false, message: "Company deleted" };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to delete company" };
  }
};
