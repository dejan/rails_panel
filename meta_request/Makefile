build:
	@echo "\n------------------ Running unit tests ---------------------\n"
	bundle exec rake test:unit
	@echo "\n-------------- Running functional tests -------------------\n"
	cd test/functional/rails-4.1.4 && bundle install > /dev/null 2>&1 && bundle exec rake test
