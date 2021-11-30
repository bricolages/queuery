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
    apt-get install -y -q build-essential libpq-dev postgresql-client && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /app

RUN gem install bundler -v 2.2.3
COPY unicorn.conf.rb /etc/unicorn/unicorn.conf.rb
COPY Gemfile /app
COPY Gemfile.lock /app
RUN bundle config set deployment 'true' \
    && bundle config set path '/gems' \
    && bundle config set without 'development test' \
    && bundle install -j$(nproc)

COPY . /app
COPY --from=console /app/public/console /app/public/console

CMD ["bundle", "exec", "unicorn", "-c", "/etc/unicorn/unicorn.conf.rb"]
