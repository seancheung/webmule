import { Client } from "emuled";
import prisma from "./prisma";

const emuledClientSingleton = () => {
  console.log("created emuled client");
  const client = new Client({
    clientPort: isNaN(process.env.EMULE_CLIENT_PORT as unknown as number)
      ? 15490
      : parseInt(process.env.EMULE_CLIENT_PORT as string),
  });
  client.on("connected", (session) => {
    console.log(`connected to ${session.server?.host}:${session.server?.port}`);
    client.login();
  });
  client.on("idchange", (session) => {
    console.log(`id changed to ${session.clientId}`);
  });
  client.on("disconnected", () => {
    console.log("disconnected");
  });
  client.on("error", (error) => {
    console.error(error);
  });
  client.on("searchresult", (session) => {
    console.log("received search results");
    if (session.lastQuery && session.results && session.server) {
      const files = session.results[session.lastQuery];
      if (files && files.length) {
        prisma.history
          .create({
            data: {
              query: session.lastQuery,
              server: {
                connect: {
                  host_port: {
                    host: session.server.host,
                    port: session.server.port,
                  },
                },
              },
              files: {
                create: files.map((file) => ({
                  file: {
                    connectOrCreate: {
                      where: {
                        hash: file.hash,
                      },
                      create: {
                        hash: file.hash,
                        name: file.name,
                        size: file.size,
                        sources: file.sources,
                        complete: file.complete,
                      },
                    },
                  },
                })),
              },
            },
          })
          .then(() => console.log("results saved to history"))
          .catch(console.error);
      }
    }
  });
  return client;
};

declare global {
  // eslint-disable-next-line no-var
  var emule: undefined | ReturnType<typeof emuledClientSingleton>;
}

const emule = globalThis.emule ?? emuledClientSingleton();

export default emule;

if (process.env.NODE_ENV !== "production") globalThis.emule = emule;
