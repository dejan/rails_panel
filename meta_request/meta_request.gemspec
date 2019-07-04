# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'meta_request/version'

Gem::Specification.new do |gem|
  gem.name         = 'meta_request'
  gem.summary      = 'Request your Rails request'
  gem.description  = 'Supporting gem for Rails Panel (Google Chrome extension for Rails development)'

  gem.version      = MetaRequest::VERSION

  gem.author       = 'Dejan Simic'
  gem.email        = 'desimic@gmail.com'
  gem.homepage     = 'https://github.com/dejan/rails_panel/tree/master/meta_request'
  gem.license      = 'MIT'

  gem.add_dependency 'railties', '>= 3.0.0', '< 7'
  gem.add_dependency 'rack-contrib', '>= 1.1', '< 3'
  gem.add_dependency 'callsite', '~> 0.0', '>= 0.0.11'

  gem.files        = Dir['README.md', 'lib/**/*.rb']
end
