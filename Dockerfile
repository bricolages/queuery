FROM node:10-alpine as console

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN yarn

COPY ./console /app/console
COPY tsconfig.json /app
RUN yarn run build

FROM ruby:3.0.0-slim-buster

RUN apt-get update && \
    apt-get install -y -q libpq-dev postgresql-client && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /app

COPY Gemfile /app
COPY Gemfile.lock /app
RUN bundle install -j$(nproc) --deployment --without 'development test'

COPY . /app
COPY --from=console /app/public/console /app/public/console

CMD ["bundle", "exec", "unicorn", "-c", "/etc/unicorn/unicorn.conf.rb"]
