## 2019-08-03 meta_request 0.7.2
* Added source_path config for better xp working with Docker https://github.com/dejan/rails_panel/pull/162

## 2019-08-02 meta_request 0.7.1
* Fix dev caller localtion https://github.com/dejan/rails_panel/pull/146
* Handle missing SQL location https://github.com/dejan/rails_panel/pull/148
* Storage pool size configuration https://github.com/dejan/rails_panel/pull/149

## 2019-05-09 RailsPanel 0.3.2
* Fix empty rails panel in Chrome https://github.com/dejan/rails_panel/pull/150

## 2019-04-28 meta_request 0.7.0
* Add rails 6.0-beta support https://github.com/dejan/rails_panel/pull/151

## 2018-04-06 meta_request 0.6.0
* Add Sequel support https://github.com/dejan/rails_panel/pull/127

## 2017-12-07 meta_request 0.5.0
* Add rails 5.2 support https://github.com/dejan/rails_panel/pull/138

## 2017-12-05 RailsPanel 0.3.2
* Fix #134 - Broken in Chrome 62
* Add support for VSCode

## 2017-04-25 meta_request 0.4.3
* Relax rack-contrib requirement

## 2017-05-03 meta_request 0.4.2
* Support Rails 5.2

## 2016-04-11 RailsPanel 0.3.1
* Fix RubyMine IDE integration

## 2016-04-11 meta_request 0.4.1
* Don't override method signatures of base logger https://github.com/dejan/rails_panel/pull/107

## 2016-02-18 meta_request 0.4.0 & RailsPanel 0.3.0
* more rails 5 fixes https://github.com/dejan/rails_panel/pull/99
* Add "Atom" to the list of supported editors https://github.com/dejan/rails_panel/pull/102
* add cache tab, fix rendering of color logging https://github.com/dejan/rails_panel/pull/103
* Accept rails 5.0 https://github.com/dejan/rails_panel/pull/97
* Fix CI failure https://github.com/dejan/rails_panel/pull/98
* Add instructions for clearing the console https://github.com/dejan/rails_panel/pull/89
* use a frozen copy of Rails.root in AppNotifications and LogInterceptor https://github.com/dejan/rails_panel/pull/86

## 2014-12-04 RailsPanel 0.2.4
* Set background color so it doesn`t look broken with dark devtools theme

## 2014-12-04 RailsPanel 0.2.3
* Fix padding issues with tabs

## 2014-07-30 meta_request 0.3.4 & RailsPanel 0.2.2
* Fix error panel & conflict with BetterErrors

## 2014-07-07 meta_request 0.3.3
* gemspec cleanup

## 2014-05-19 RailsPanel 0.2.1
* Fix width of Response Time column in horizontal mode
* Maintain minimum width of the details panel while resizing in vertical mode

## 2014-05-18 RailsPanel 0.2.0
* UI changes: time units, breakdown tab, minor tweaks & fixes

## 2014-04-16 RailsPanel 0.1.9 & meta_request 0.3.0
* ActiveRecord & Log entries caller locations https://github.com/dejan/rails_panel/issues/13
* Optional display for cached ActiveRecord queries https://github.com/dejan/rails_panel/pull/68

## 2014-04-07 meta_request 0.2.9
* Fix logging https://github.com/dejan/rails_panel/issues/64

## 2014-01-13 RailsPanel 0.1.8
* Panel dividers

## 2013-08-06 RailsPanel 0.1.6 & meta_request 0.2.8
* Fix negative time values displaying in Rails 4 #58
* Support lowercased headers (fixes problems with pow)
* Drop support for Ruby ver < 1.9.3

## 2013-06-23 meta_request 0.2.7
* Subscribe to only Notifications relevant to RailsPanel; Fixes #55, #59, #60, #61

## 2013-05-26 meta_request 0.2.6
* Fix IOError #51, #52
* Fix problems with apps that change working dir

## 2013-05-08 meta_request 0.2.5
* Fix bad signature logger methods

## 2013-05-06 RailsPanel 0.1.5 & meta_request 0.2.4
* Log pane for server logs

## 2013-04-07 RailsPanel 0.1.4
* Sublime in Windows support

## 2013-03-24 meta_request 0.2.3
* Change middleware to support rails app in subfolders
* Fix Errno::ENOENT #38
* Fix SystemStackError (stack level too deep) #34

## 2013-02-24 meta_request 0.2.2
* fix #32 - stop crashing when trying to json encode closed tempfile params
* relax dependency from rails to railties
* Handle exceptions prior to rails 3.2

## 2013-02-24 RailsPanel 0.1.3
* emacs editor option

## 2013-01-15 RailsPanel 0.1.2
* Fix clear button
* Responsive design

## 2013-01-12 RailsPanel 0.1.1
* Sublime support
* Tabs styling fix for small windows.
* Sorting duration table for db and view panel
* Number of queries shown od db panel
* Added button/shortcut (⌘+k, ctrl+l) for clearing

## 2013-01-02 meta_request 0.2.1
* Rails 3.0 & 3.1 support

## 2012-30-12 RailsPanel 0.1.0
* Editor integration for TextMate and MacVim
* Fixed broken rendering when db_runtime is undefined
* Omit SCHEMA calls in db table
* HTTPS support
