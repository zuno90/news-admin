FROM node:alpine
WORKDIR /usr/src/app/admin
COPY ./package*.json .
RUN yarn
COPY . .
RUN npm ci
RUN yarn build

# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3000
# Start the app
CMD [ "yarn", "serve", "build" ]

# CMD [ "yarn", "start" ]

# # development
# FROM node:alpine as development
# WORKDIR /usr/src/app/admin
# COPY ./news-admin/package*.json .
# RUN yarn
# COPY ./news-admin .
# RUN yarn build

# # production
# FROM node:alpine as production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app/admin

# RUN yarn --only=production

# COPY --from=development /urs/src/app/dist ./dist

# CMD ["node", "dist/apps/orders/main"]