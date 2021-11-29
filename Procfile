web: docker run --rm -p $PORT:80 -v `pwd`/dev/nginx.conf:/etc/nginx/nginx.conf:ro nginx:alpine
console: yarn run serve --port 5000
api: bundle exec rails server -p 3000
