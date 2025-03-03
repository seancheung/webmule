"use server";

import emule from "@/lib/emule";
import prisma from "@/lib/prisma";
import { Prisma, Server } from "@prisma/client";
import { ConfigKey, QueryLimit } from "./constants";

export async function getSession() {
  return emule.getSession();
}

export async function getServers() {
  return prisma.server.findMany({
    select: {
      id: true,
      name: true,
      host: true,
      port: true,
    },
  });
}

export async function connectToServer(host: string, port: number) {
  return emule.connect(host, port);
}

export async function disconnectFromServer() {
  emule.disconnect();
}

export async function clearLogs() {
  emule.clearLogs();
}

export async function deleteServer(id: number) {
  await prisma.server.delete({
    where: { id },
  });
}

export async function updateServer(
  id: number,
  data: Partial<Omit<Server, "id">>,
) {
  await prisma.server.update({
    where: {
      id,
    },
    data,
  });
}

export async function addServer(data: Omit<Server, "id">) {
  await prisma.server.create({
    data,
  });
}

export async function searchFiles(query: string) {
  const session = emule.getSession();
  if (session.state === 4) {
    emule.search(query);
  }
}

export async function getQueries({
  page,
  size,
}: {
  page?: number;
  size?: number;
}) {
  const total = await prisma.history.count();
  const index = page ? Math.max(0, page - 1) : 0;
  const list = await prisma.history.findMany({
    orderBy: {
      id: "desc",
    },
    skip: Math.min(size || 0, QueryLimit) * index,
    take: Math.min(size || 0, QueryLimit),
    select: {
      id: true,
      query: true,
      createdAt: true,
      server: {
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          files: true,
        },
      },
    },
  });
  return {
    list,
    current: index + 1,
    total,
  };
}

export async function getFiles({
  query,
  queryId,
  page,
  size,
}: {
  query?: string;
  queryId?: number;
  page?: number;
  size?: number;
}) {
  let where: Prisma.FileWhereInput | undefined;
  if (query) {
    const words = query
      .replace(/[\\%_]/g, "\\$&")
      .split(/\s+/)
      .filter((e) => !!e);
    where =
      words.length > 1
        ? {
            AND: words.map((word) => ({
              name: {
                contains: word,
              },
            })),
          }
        : {
            name: {
              contains: words[0],
            },
          };
  }
  if (queryId) {
    const subWhere: Prisma.FileWhereInput = {
      histories: {
        some: {
          historyId: queryId,
        },
      },
    };
    if (where) {
      where = {
        AND: [where, subWhere],
      };
    } else {
      where = subWhere;
    }
  }
  const config = await getConfig();
  let orderBy: Prisma.FileOrderByWithRelationInput | undefined;
  if (config[ConfigKey.FileSortKey]) {
    orderBy = {
      [config[ConfigKey.FileSortKey]]: config[ConfigKey.FileSortDesc]
        ? "desc"
        : "asc",
    };
  }
  const total = await prisma.file.count({
    where,
  });
  const index = page ? Math.max(0, page - 1) : 0;
  const list = await prisma.file.findMany({
    where,
    orderBy,
    skip: Math.min(size || 0, QueryLimit) * index,
    take: Math.min(size || 0, QueryLimit),
    select: {
      id: true,
      hash: true,
      name: true,
      size: true,
      sources: true,
      complete: true,
    },
  });
  return {
    list,
    current: index + 1,
    total,
  };
}

export async function getConfig(): Promise<Record<ConfigKey, any>> {
  const records = await prisma.config.findMany({
    select: {
      key: true,
      value: true,
    },
  });
  return Object.fromEntries(
    records.map((record) => [record.key, JSON.parse(record.value)]),
  ) as Record<ConfigKey, any>;
}

export async function updateConfig(partial: Partial<Record<ConfigKey, any>>) {
  const entries = Object.entries(partial);
  if (entries.length) {
    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.config.upsert({
          where: {
            key,
          },
          create: {
            key,
            value: JSON.stringify(value),
          },
          update: {
            value: JSON.stringify(value),
          },
        }),
      ),
    );
  }
}
