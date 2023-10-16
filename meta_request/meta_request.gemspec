# frozen_string_literal: true

Gem::Specification.new do |gem|
  gem.name         = 'meta_request'
  gem.version      = '0.7.3'

  gem.summary      = 'Request your Rails request'
  gem.description  = 'Supporting gem for Rails Panel (Google Chrome extension for Rails development)'

  gem.author       = 'Dejan Simic'
  gem.email        = 'desimic@gmail.com'
  gem.homepage     = 'https://github.com/dejan/rails_panel/tree/master/meta_request'
  gem.license      = 'MIT'

  gem.add_dependency 'rack-contrib', '>= 1.1', '< 3'
  gem.add_dependency 'railties', '>= 3.0.0', '< 7.2'
  gem.add_development_dependency 'rspec', '~> 3.8.0'
  gem.add_development_dependency 'rubocop', '~> 0.74.0'

  gem.files = Dir['README.md', 'lib/**/*.rb']
end
