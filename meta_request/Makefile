build:
	@echo "\n------------------ Running unit tests ---------------------\n"
	bundle exec rake test:unit
	@echo "\n-------------- Running functional tests -------------------\n"
	cd test/functional/rails-4.1.4 && bundle install && bundle exec rake test
