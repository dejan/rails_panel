RailsPanel
===========

RailsPanel is a Chrome/Firefox extension for Rails development that will end your tailing of development.log. Have all information about your Rails app requests in the browser - in the Developer Tools panel. Provides insight to db/rendering/total times, parameter list, rendered views and more.

![railspanel](https://cloud.githubusercontent.com/assets/4494/3090049/917e5378-e586-11e3-9bd4-1db232968126.png)

## Installation

To use this extension you need to add meta_request gem to your app's Gemfile:

```ruby
group :development do
  gem 'meta_request'
end
```

After this, install RailsPanel extension for [Chrome](https://chrome.google.com/webstore/detail/railspanel/gjpfobpafnhjhbajcjgccbbdofdckggg) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/rails-panel). This is recommended way of installing the extension, since it will auto-update on every new version.

## Install unpacked version

If you have a problem installing extension from Chrome Store or just want to run latest and hack on it, just clone the repo (say under `~/workspace/rails_panel`) and in "Developer mode" Chrome Extensions page select "Load Unpacked extension..." and select `~/workspace/rails_panel/rails_panel`.

## Supported environments

* Rails 5, 6 and 7
* Ruby 3

## Editor integration

Select your preferred editor on the extension options page. Following editors are supported:

* MacVim
* TextMate
* Sublime
* Emacs
* Atom
* RubyMine

## Compatibility Warnings

If you're using [LiveReload](http://livereload.com/) or
[Rack::LiveReload](https://github.com/johnbintz/rack-livereload) make sure to
exclude watching your tmp/ folder because meta_request writes a lot of data there
and your browser will refresh like a madman.

## Clearing the Console

You can clear the panel with the usual shortcuts of ⌘+K or ctrl+L.

## Licence

Copyright (c) 2012 Dejan Simic

MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
