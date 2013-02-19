# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'meta_request/version'

Gem::Specification.new do |gem|
  gem.name          = "meta_request"
  gem.version       = MetaRequest::VERSION
  gem.authors       = ["Dejan Simic"]
  gem.email         = ["desimic@gmail.com"]
  gem.description   = %q{Request your request}
  gem.summary       = %q{Supporting gem for Rails Panel (Google Chrome extension for Rails development)}
  gem.homepage      = "https://github.com/dejan/rails_panel/tree/master/meta_request"

  gem.add_dependency('railties')
  gem.add_dependency('rack-contrib')

  gem.files         = `git ls-files`.split($/)
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.require_paths = ["lib"]
end
