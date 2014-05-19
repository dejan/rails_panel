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
