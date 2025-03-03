FROM node:lts AS builder
WORKDIR /app
COPY src ./src
COPY prisma ./prisma
COPY *.json *.js *.mjs *.ts ./
RUN npm install
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build
RUN npx prisma generate

FROM node:lts AS runner
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client

EXPOSE 3000
ENV PORT 3000
ENV DATABASE_URL file:/app/database.sqlite

CMD ["npm", "start"]