FROM ruby:2.5-alpine

RUN apk add --update --no-cache \
    build-base git openssh

RUN mkdir /app
WORKDIR /app

COPY Gemfile /app
COPY meta_request.gemspec /app

RUN bundle install

COPY . /app

CMD ["bundle", "exec", "rspec"]
