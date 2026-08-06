import {
  withRequestId,
  scaleTimedEvents,
  injectSqlEvents,
  patchProcessAction,
  makeSqlEvent,
  makeProcessAction,
  makeViewEvent,
  makeCacheEvent,
  makeSqlDebugLogs,
  makeExceptionEvents,
  makeRequest,
} from './fixtureHelpers.js'

/** Raw captures used as bases for derived demo variants. */
const capturedRequests = [
  {
    request_id: "31fc50ed-3d47-4d5c-9d54-2683b1b4a791", events: [
      {
        "name": "sql.active_record",
        "payload": {
          "sql": "SELECT \"diagrams\".* FROM \"diagrams\" WHERE \"diagrams\".\"id\" = $1 LIMIT $2",
          "name": "Diagram Load",
          "binds": "Not JSON Encodable",
          "type_casted_binds": [
            93,
            1
          ],
          "statement_name": "a1",
          "async": false,
          "connection": "Not JSON Encodable",
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/models/diagram.rb",
          "line": 21,
          "method": "find_by_short_id"
        },
        "time": 1713308146473.6833,
        "transaction_id": "80f9d6917b7b4fd520a1",
        "end": 1713308146473.9082,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.224856
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/models/diagram.rb",
          "line": 21,
          "method": "find_by_short_id",
          "message": "  \u001b[1m\u001b[36mDiagram Load (0.8ms)\u001b[0m  \u001b[1m\u001b[34mSELECT \"diagrams\".* FROM \"diagrams\" WHERE \"diagrams\".\"id\" = $1 LIMIT $2\u001b[0m  [[\"id\", 93], [\"LIMIT\", 1]]",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/models/diagram.rb",
          "line": 21,
          "method": "find_by_short_id",
          "message": "  ↳ app/models/diagram.rb:21:in `find_by_short_id'",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "sql.active_record",
        "payload": {
          "sql": "SELECT \"users\".* FROM \"users\" WHERE \"users\".\"id\" = $1 LIMIT $2",
          "name": "User Load",
          "binds": "Not JSON Encodable",
          "type_casted_binds": [
            2,
            1
          ],
          "statement_name": "a2",
          "async": false,
          "connection": "Not JSON Encodable",
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/controllers/diagrams_controller.rb",
          "line": 30,
          "method": "show"
        },
        "time": 1713308146476.3801,
        "transaction_id": "80f9d6917b7b4fd520a1",
        "end": 1713308146476.5178,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.13774
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/controllers/diagrams_controller.rb",
          "line": 30,
          "method": "show",
          "message": "  \u001b[1m\u001b[36mUser Load (0.6ms)\u001b[0m  \u001b[1m\u001b[34mSELECT \"users\".* FROM \"users\" WHERE \"users\".\"id\" = $1 LIMIT $2\u001b[0m  [[\"id\", 2], [\"LIMIT\", 1]]",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/controllers/diagrams_controller.rb",
          "line": 30,
          "method": "show",
          "message": "  ↳ app/controllers/diagrams_controller.rb:30:in `show'",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "sql.active_record",
        "payload": {
          "sql": "SELECT \"users\".* FROM \"users\" WHERE \"users\".\"deleted_at\" IS NULL AND \"users\".\"id\" IS NULL LIMIT $1",
          "name": "User Load",
          "binds": "Not JSON Encodable",
          "type_casted_binds": [
            1
          ],
          "statement_name": "a3",
          "async": false,
          "connection": "Not JSON Encodable",
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/controllers/application_controller.rb",
          "line": 5,
          "method": "current_user"
        },
        "time": 1713308146479.048,
        "transaction_id": "80f9d6917b7b4fd520a1",
        "end": 1713308146479.2686,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.220638
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/controllers/application_controller.rb",
          "line": 5,
          "method": "current_user",
          "message": "  \u001b[1m\u001b[36mUser Load (1.0ms)\u001b[0m  \u001b[1m\u001b[34mSELECT \"users\".* FROM \"users\" WHERE \"users\".\"deleted_at\" IS NULL AND \"users\".\"id\" IS NULL LIMIT $1\u001b[0m  [[\"LIMIT\", 1]]",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/controllers/application_controller.rb",
          "line": 5,
          "method": "current_user",
          "message": "  ↳ app/controllers/application_controller.rb:5:in `current_user'",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "render_partial.action_view",
        "payload": {
          "identifier": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/views/diagrams/_title.html.erb",
          "layout": null,
          "locals": {
            "diagram": "Not JSON Encodable"
          },
          "cache_hit": null
        },
        "time": 1713308146484.0317,
        "transaction_id": "11e3942831f4ec0c7418",
        "end": 1713308146484.0652,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.033513
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/views/diagrams/show/_toolbar.html.erb",
          "line": 14,
          "method": "_app_views_diagrams_show__toolbar_html_erb__2067814816576565409_47020",
          "message": null,
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "render_partial.action_view",
        "payload": {
          "identifier": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/views/diagrams/show/_toolbar.html.erb",
          "layout": null,
          "locals": {
            
          },
          "cache_hit": null
        },
        "time": 1713308146483.9116,
        "transaction_id": "11e3942831f4ec0c7418",
        "end": 1713308146486.0718,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 2.1603920000000003
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/views/diagrams/show.html.erb",
          "line": 15,
          "method": "_app_views_diagrams_show_html_erb___4231706836057209818_47000",
          "message": null,
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "render_partial.action_view",
        "payload": {
          "identifier": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/views/diagrams/show/_code.html.erb",
          "layout": null,
          "locals": {
            
          },
          "cache_hit": null
        },
        "time": 1713308146486.5854,
        "transaction_id": "11e3942831f4ec0c7418",
        "end": 1713308146488.222,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 1.6365699999999999
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/views/diagrams/show.html.erb",
          "line": 16,
          "method": "_app_views_diagrams_show_html_erb___4231706836057209818_47000",
          "message": null,
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "render_template.action_view",
        "payload": {
          "identifier": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/views/diagrams/show.html.erb",
          "layout": "layouts/application",
          "locals": {
            
          }
        },
        "time": 1713308146482.844,
        "transaction_id": "11e3942831f4ec0c7418",
        "end": 1713308146488.981,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 6.136813
      },
      {
        "name": "render_partial.action_view",
        "payload": {
          "identifier": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/views/layouts/_umami.html.erb",
          "layout": null,
          "locals": {
            
          },
          "cache_hit": null
        },
        "time": 1713308146500.3508,
        "transaction_id": "11e3942831f4ec0c7418",
        "end": 1713308146500.3992,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.048432
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/views/layouts/application.html.erb",
          "line": 13,
          "method": "_app_views_layouts_application_html_erb__2750436237097443249_28880",
          "message": null,
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "process_action.action_controller",
        "payload": {
          "controller": "DiagramsController",
          "action": "show",
          "request": "Not JSON Encodable",
          "params": {
            "controller": "diagrams",
            "action": "show",
            "id": "p5CklVeMgb"
          },
          "headers": {
            "SCRIPT_NAME": "",
            "QUERY_STRING": "",
            "SERVER_SOFTWARE": "puma 6.4.2 The Eagle of Durango",
            "GATEWAY_INTERFACE": "CGI/1.2",
            "REQUEST_METHOD": "GET",
            "REQUEST_PATH": "/diagrams/p5CklVeMgb",
            "REQUEST_URI": "/diagrams/p5CklVeMgb",
            "SERVER_PROTOCOL": "HTTP/1.1",
            "HTTP_HOST": "localhost:3000",
            "HTTP_CONNECTION": "keep-alive",
            "HTTP_SEC_CH_UA": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
            "HTTP_DNT": "1",
            "HTTP_X_SEC_PURPOSE": "prefetch",
            "HTTP_SEC_CH_UA_MOBILE": "?0",
            "HTTP_USER_AGENT": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "HTTP_ACCEPT": "text/html, application/xhtml+xml",
            "HTTP_X_TURBO_REQUEST_ID": "10814ae3-9aa1-4a8d-91c7-5d95a98323a0",
            "HTTP_SEC_CH_UA_PLATFORM": "\"Linux\"",
            "HTTP_SEC_FETCH_SITE": "same-origin",
            "HTTP_SEC_FETCH_MODE": "cors",
            "HTTP_SEC_FETCH_DEST": "empty",
            "HTTP_REFERER": "http://localhost:3000/",
            "HTTP_ACCEPT_ENCODING": "gzip, deflate, br, zstd",
            "HTTP_ACCEPT_LANGUAGE": "en-US,en;q=0.9,hr;q=0.8,bs;q=0.7",
            "HTTP_COOKIE": "_hellorailsworld_session=iUflrFkEPAdM4C%2FPpWnvAzRL95",
            "HTTP_IF_NONE_MATCH": "W/\"df55b529b639b4494509f2b9252ca53b\"",
            "SERVER_NAME": "localhost",
            "SERVER_PORT": "3000",
            "PATH_INFO": "/diagrams/p5CklVeMgb",
            "REMOTE_ADDR": "::1",
            "HTTP_VERSION": "HTTP/1.1",
            "ROUTES_13000_SCRIPT_NAME": "",
            "ORIGINAL_FULLPATH": "/diagrams/p5CklVeMgb",
            "ORIGINAL_SCRIPT_NAME": ""
          },
          "format": "html",
          "method": "GET",
          "path": "/diagrams/p5CklVeMgb",
          "response": "Not JSON Encodable",
          "status": 200,
          "view_runtime": 19.443564990069717,
          "db_runtime": 0.5492499913088977
        },
        "time": 1713308146472.683,
        "transaction_id": "11e3942831f4ec0c7418",
        "end": 1713308146501.6614,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 28.977915
      }
    ]  
  },
  {
    request_id: "a8e3f2c1-4b5d-4e6f-8a9b-0c1d2e3f4a5b", events: [
      {
        "name": "sql.active_record",
        "payload": {
          "sql": "SELECT \"diagrams\".* FROM \"diagrams\" WHERE \"diagrams\".\"id\" = $1 LIMIT $2",
          "name": "Diagram Load",
          "binds": "Not JSON Encodable",
          "type_casted_binds": [
            69,
            1
          ],
          "statement_name": "a1",
          "async": false,
          "connection": "Not JSON Encodable",
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/models/diagram.rb",
          "line": 21,
          "method": "find_by_short_id"
        },
        "time": 1713311193943.1948,
        "transaction_id": "532d8a72afa27a961e85",
        "end": 1713311193943.5664,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.371353
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/models/diagram.rb",
          "line": 21,
          "method": "find_by_short_id",
          "message": "  \u001b[1m\u001b[36mDiagram Load (0.8ms)\u001b[0m  \u001b[1m\u001b[34mSELECT \"diagrams\".* FROM \"diagrams\" WHERE \"diagrams\".\"id\" = $1 LIMIT $2\u001b[0m  [[\"id\", 69], [\"LIMIT\", 1]]",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/models/diagram.rb",
          "line": 21,
          "method": "find_by_short_id",
          "message": "  ↳ app/models/diagram.rb:21:in `find_by_short_id'",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "sql.active_record",
        "payload": {
          "sql": "SELECT \"users\".* FROM \"users\" WHERE \"users\".\"id\" = $1 LIMIT $2",
          "name": "User Load",
          "binds": "Not JSON Encodable",
          "type_casted_binds": [
            2,
            1
          ],
          "statement_name": "a2",
          "async": false,
          "connection": "Not JSON Encodable",
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/controllers/diagrams_controller.rb",
          "line": 98,
          "method": "thumbnail"
        },
        "time": 1713311193945.9443,
        "transaction_id": "532d8a72afa27a961e85",
        "end": 1713311193946.2288,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.284368
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/controllers/diagrams_controller.rb",
          "line": 98,
          "method": "thumbnail",
          "message": "  \u001b[1m\u001b[36mUser Load (0.7ms)\u001b[0m  \u001b[1m\u001b[34mSELECT \"users\".* FROM \"users\" WHERE \"users\".\"id\" = $1 LIMIT $2\u001b[0m  [[\"id\", 2], [\"LIMIT\", 1]]",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/controllers/diagrams_controller.rb",
          "line": 98,
          "method": "thumbnail",
          "message": "  ↳ app/controllers/diagrams_controller.rb:98:in `thumbnail'",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "sql.active_record",
        "payload": {
          "sql": "SELECT \"users\".* FROM \"users\" WHERE \"users\".\"deleted_at\" IS NULL AND \"users\".\"id\" IS NULL LIMIT $1",
          "name": "User Load",
          "binds": "Not JSON Encodable",
          "type_casted_binds": [
            1
          ],
          "statement_name": "a3",
          "async": false,
          "connection": "Not JSON Encodable",
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/controllers/application_controller.rb",
          "line": 5,
          "method": "current_user"
        },
        "time": 1713311193948.9285,
        "transaction_id": "532d8a72afa27a961e85",
        "end": 1713311193949.3562,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.428071
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/controllers/application_controller.rb",
          "line": 5,
          "method": "current_user",
          "message": "  \u001b[1m\u001b[36mUser Load (0.9ms)\u001b[0m  \u001b[1m\u001b[34mSELECT \"users\".* FROM \"users\" WHERE \"users\".\"deleted_at\" IS NULL AND \"users\".\"id\" IS NULL LIMIT $1\u001b[0m  [[\"LIMIT\", 1]]",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/diagrammatic/diagrammatic/app/controllers/application_controller.rb",
          "line": 5,
          "method": "current_user",
          "message": "  ↳ app/controllers/application_controller.rb:5:in `current_user'",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "process_action.action_controller",
        "payload": {
          "controller": "DiagramsController",
          "action": "thumbnail",
          "request": "Not JSON Encodable",
          "params": {
            "t": "1706485106",
            "controller": "diagrams",
            "action": "thumbnail",
            "id": "ARbs1igzRC"
          },
          "headers": {
            "SCRIPT_NAME": "",
            "QUERY_STRING": "t=1706485106",
            "SERVER_SOFTWARE": "puma 6.4.2 The Eagle of Durango",
            "GATEWAY_INTERFACE": "CGI/1.2",
            "REQUEST_METHOD": "GET",
            "REQUEST_PATH": "/diagrams/ARbs1igzRC/thumbnail",
            "REQUEST_URI": "/diagrams/ARbs1igzRC/thumbnail?t=1706485106",
            "SERVER_PROTOCOL": "HTTP/1.1",
            "HTTP_HOST": "localhost:3000",
            "HTTP_CONNECTION": "keep-alive",
            "HTTP_SEC_CH_UA": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
            "HTTP_DNT": "1",
            "HTTP_SEC_CH_UA_MOBILE": "?0",
            "HTTP_USER_AGENT": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "HTTP_SEC_CH_UA_PLATFORM": "\"Linux\"",
            "HTTP_ACCEPT": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            "HTTP_SEC_FETCH_SITE": "same-origin",
            "HTTP_SEC_FETCH_MODE": "no-cors",
            "HTTP_SEC_FETCH_DEST": "image",
            "HTTP_REFERER": "http://localhost:3000/",
            "HTTP_ACCEPT_ENCODING": "gzip, deflate, br, zstd",
            "HTTP_ACCEPT_LANGUAGE": "en-US,en;q=0.9,hr;q=0.8,bs;q=0.7",
            "HTTP_COOKIE": "_hellorailsworld_session=foobar",
            "SERVER_NAME": "localhost",
            "SERVER_PORT": "3000",
            "PATH_INFO": "/diagrams/ARbs1igzRC/thumbnail",
            "REMOTE_ADDR": "::1",
            "HTTP_VERSION": "HTTP/1.1",
            "ROUTES_13000_SCRIPT_NAME": "",
            "ORIGINAL_FULLPATH": "/diagrams/ARbs1igzRC/thumbnail?t=1706485106",
            "ORIGINAL_SCRIPT_NAME": ""
          },
          "format": "html",
          "method": "GET",
          "path": "/diagrams/ARbs1igzRC/thumbnail?t=1706485106",
          "status": "500",
          "view_runtime": null,
          "db_runtime": 1.0678610124159604,
          "exception": [
            "Shrine::FileNotFound",
            "file \"47f15b2d2f0b48730f2753c4f4bcf8bf.svg\" not found on storage"
          ],
          "exception_object": "file \"47f15b2d2f0b48730f2753c4f4bcf8bf.svg\" not found on storage"
        },
        "time": 1713311193928.6956,
        "transaction_id": "11e3942831f4ec0c7418",
        "end": 1713311193951.5461,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 22.850392
      },
      {
        "name": "process_action.action_controller.exception",
        "payload": {
          "call": "Shrine::FileNotFound (file \"47f15b2d2f0b48730f2753c4f4bcf8bf.svg\" not found on storage)"
        },
        "time": 0.0,
        "transaction_id": null,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "process_action.action_controller.exception",
        "payload": {
          "call": "app/controllers/diagrams_controller.rb:105:in `thumbnail'"
        },
        "time": 0.0,
        "transaction_id": null,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "process_action.action_controller.exception",
        "payload": {
          "call": "app/models/diagram.rb:88:in `thumbnail_url'"
        },
        "time": 0.0,
        "transaction_id": null,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "process_action.action_controller.exception",
        "payload": {
          "call": "app/uploaders/svg_uploader.rb:14:in `url'"
        },
        "time": 0.0,
        "transaction_id": null,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "process_action.action_controller.exception",
        "payload": {
          "call": "shrine (3.5.0) lib/shrine/storage/file_system.rb:92:in `open'"
        },
        "time": 0.0,
        "transaction_id": null,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "process_action.action_controller.exception",
        "payload": {
          "call": "actionpack (7.1.3) lib/action_controller/metal/basic_implicit_render.rb:6:in `send_action'"
        },
        "time": 0.0,
        "transaction_id": null,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "process_action.action_controller.exception",
        "payload": {
          "call": "actionpack (7.1.3) lib/abstract_controller/base.rb:224:in `process_action'"
        },
        "time": 0.0,
        "transaction_id": null,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "process_action.action_controller.exception",
        "payload": {
          "call": "actionpack (7.1.3) lib/action_controller/metal/rendering.rb:165:in `process_action'"
        },
        "time": 0.0,
        "transaction_id": null,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "process_action.action_controller.exception",
        "payload": {
          "call": "activesupport (7.1.3) lib/active_support/notifications.rb:206:in `block in instrument'"
        },
        "time": 0.0,
        "transaction_id": null,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      }
    ]
  },
  {
    request_id: "1860f1f3-a7a7-41b0-a2f3-a1bca089bb6d", events: [
      {
        "name": "cache_write.active_support",
        "payload": {
          "key": "hello",
          "type": "write",
          "options": {
            "store": "ActiveSupport::Cache::MemoryStore",
            "compress": false,
            "compress_threshold": 1024
          },
          "filename": "/home/dejan/src/github.com/dejan/hellorailsworld/app/controllers/hello_controller.rb",
          "line": 4,
          "method": "index"
        },
        "time": 1713473865502.4465,
        "transaction_id": "eb8047af8fc46887b428",
        "end": 1713473865502.4993,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.05298
      },
      {
        "name": "cache_read.active_support",
        "payload": {
          "key": "hello",
          "hit": true,
          "type": "read",
          "options": {
            "store": "ActiveSupport::Cache::MemoryStore",
            "compress": false,
            "compress_threshold": 1024
          },
          "filename": "/home/dejan/src/github.com/dejan/hellorailsworld/app/controllers/hello_controller.rb",
          "line": 5,
          "method": "index"
        },
        "time": 1713473865503.0295,
        "transaction_id": "eb8047af8fc46887b428",
        "end": 1713473865503.0474,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.017974
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/dejan/hellorailsworld/app/controllers/hello_controller.rb",
          "line": 6,
          "method": "index",
          "message": "Hello, world!",
          "level": "info"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "render_template.action_view",
        "payload": {
          "identifier": "/home/dejan/src/github.com/dejan/hellorailsworld/app/views/hello/index.html.erb",
          "layout": "layouts/application",
          "locals": {
            
          }
        },
        "time": 1713473865504.561,
        "transaction_id": "eb8047af8fc46887b428",
        "end": 1713473865504.8638,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.302813
      },
      {
        "name": "process_action.action_controller",
        "payload": {
          "controller": "HelloController",
          "action": "index",
          "request": "Not JSON Encodable",
          "params": {
            "controller": "hello",
            "action": "index"
          },
          "headers": {
            "SCRIPT_NAME": "",
            "QUERY_STRING": "",
            "SERVER_SOFTWARE": "puma 6.4.2 The Eagle of Durango",
            "GATEWAY_INTERFACE": "CGI/1.2",
            "REQUEST_METHOD": "GET",
            "REQUEST_PATH": "/",
            "REQUEST_URI": "/",
            "SERVER_PROTOCOL": "HTTP/1.1",
            "HTTP_HOST": "localhost:3000",
            "HTTP_CONNECTION": "keep-alive",
            "HTTP_CACHE_CONTROL": "max-age=0",
            "HTTP_SEC_CH_UA": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
            "HTTP_SEC_CH_UA_MOBILE": "?0",
            "HTTP_SEC_CH_UA_PLATFORM": "\"Linux\"",
            "HTTP_DNT": "1",
            "HTTP_UPGRADE_INSECURE_REQUESTS": "1",
            "HTTP_USER_AGENT": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "HTTP_ACCEPT": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "HTTP_SEC_FETCH_SITE": "same-origin",
            "HTTP_SEC_FETCH_MODE": "navigate",
            "HTTP_SEC_FETCH_USER": "?1",
            "HTTP_SEC_FETCH_DEST": "document",
            "HTTP_ACCEPT_ENCODING": "gzip, deflate, br",
            "HTTP_ACCEPT_LANGUAGE": "en-US,en;q=0.9,hr;q=0.8,bs;q=0.7",
            "HTTP_COOKIE": "_diagrammatic_session=3QtGuHMdcirVtFJlFJw0BmrXahIiYxrmQmvsxrEqQwT%2BMPCMzDEkrQQ1vXUyVLQLbOC3LnWPus8U6K41FErMLSFC%2FIRh5%2FqOCkA2SKk2oXxGT1LL9vFlLk3hUq9xEuiSaZ4yXg4GR9Z3Fhahbr%2BQ3a9ol8%2Bq4JFVF8Y7OpkNHubyCGmRXMhhpL%2Ft4%2FKhKiv3CuXCyfLyvcsk4dz3ulCVxJp2oYOPE2GackR2il6ZHdfbHo3Tfv5O707%2BE2Frh%2FRXeKMjj2dQFpNBXAcltmn9mUgJA%2BB8h%2B4PP3i6uKYmfAYoxFMAQwYjTwbkFHYtv1YoVZHyEbftOkvOyO9nGnrdedHvk6OUIDMCfUo4fXeW64nKduCdgTDO8b0xSP48t6B3y0Nrl612T78GHQnCZNRP1Zwgjj%2FpdH59KjsQpPmpOYv7usLjhAKCD%2B4TvTBgApUtYFPZ790%3D--tb5B8fNXG9%2FvC%2F%2Fl--PCWlq9MBHVbkpgLTMPZS%2FA%3D%3D; _hellorailsworld_session=DJD5gYfktM2P8RN546ydwFGsnXO4b1YhEEjy8bBgeSHdxE027hoIYookpxGq%2BLuaKd7wwNd54AjVCIW8QVmJfpcaZ5eGoLHq4huY%2FB7qpNPRDzM2JQZ8QzSrwCCDZA%2BIxtmu0j4FwHOgi%2BG8fZvAd%2FKCo9KR4VWXSQTz1yqGUAkRAJGoSgdpGtDwltImKDqOGatCWmzOyGv9jEKt%2F8m5GZ8is0tIKOsopPgu5cACJzx5v43pjUmzKmVB3SM27PAkpfpyQMXKRgHK7ostWatKxXXbNSLsRj6KsPphTFIrqck%3D--iG5hemWA5%2BaVODYF--OoyaQYzE%2F0V84a5AEBWu1g%3D%3D",
            "SERVER_NAME": "localhost",
            "SERVER_PORT": "3000",
            "PATH_INFO": "/",
            "REMOTE_ADDR": "::1",
            "HTTP_VERSION": "HTTP/1.1",
            "ROUTES_11300_SCRIPT_NAME": "",
            "ORIGINAL_FULLPATH": "/",
            "ORIGINAL_SCRIPT_NAME": ""
          },
          "format": "html",
          "method": "GET",
          "path": "/",
          "response": "Not JSON Encodable",
          "status": 200,
          "view_runtime": 56.59442499927536,
          "db_runtime": 0.0
        },
        "time": 1713473865502.191,
        "transaction_id": "eb8047af8fc46887b428",
        "end": 1713473865560.3662,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 58.175268
      }
    ]
  },
  {
    request_id: "5e77aac7-aeae-460d-a6f8-424b93bbd5d2", events: [
      {
        "name": "sql.active_record",
        "payload": {
          "sql": "SELECT \"quotes\".* FROM \"quotes\" WHERE \"quotes\".\"id\" = ? LIMIT ?",
          "name": "Quote Load",
          "binds": "Not JSON Encodable",
          "type_casted_binds": [
            65,
            1
          ],
          "statement_name": null,
          "async": false,
          "connection": "Not JSON Encodable",
          "filename": "/home/dejan/src/github.com/dejan/quotes/app/controllers/quotes_controller.rb",
          "line": 63,
          "method": "set_quote"
        },
        "time": 1714195459466.1008,
        "transaction_id": "cddc5762136011526a25",
        "end": 1714195459466.1633,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.062417999999999994
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/dejan/quotes/app/controllers/quotes_controller.rb",
          "line": 63,
          "method": "set_quote",
          "message": "  \u001b[1m\u001b[36mQuote Load (0.4ms)\u001b[0m  \u001b[1m\u001b[34mSELECT \"quotes\".* FROM \"quotes\" WHERE \"quotes\".\"id\" = ? LIMIT ?\u001b[0m  [[\"id\", 65], [\"LIMIT\", 1]]",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/dejan/quotes/app/controllers/quotes_controller.rb",
          "line": 63,
          "method": "set_quote",
          "message": "  ↳ app/controllers/quotes_controller.rb:63:in `set_quote'",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "sql.active_record",
        "payload": {
          "sql": "begin transaction",
          "name": "TRANSACTION",
          "binds": [
            
          ],
          "type_casted_binds": [
            
          ],
          "statement_name": null,
          "async": false,
          "connection": "Not JSON Encodable",
          "filename": "/home/dejan/src/github.com/dejan/quotes/app/controllers/quotes_controller.rb",
          "line": 40,
          "method": "block in update"
        },
        "time": 1714195459467.7502,
        "transaction_id": "cddc5762136011526a25",
        "end": 1714195459467.7832,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.032823
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/dejan/quotes/app/controllers/quotes_controller.rb",
          "line": 40,
          "method": "block in update",
          "message": "  \u001b[1m\u001b[36mTRANSACTION (0.3ms)\u001b[0m  \u001b[1m\u001b[36mbegin transaction\u001b[0m",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/dejan/quotes/app/controllers/quotes_controller.rb",
          "line": 40,
          "method": "block in update",
          "message": "  ↳ app/controllers/quotes_controller.rb:40:in `block in update'",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "sql.active_record",
        "payload": {
          "sql": "UPDATE \"quotes\" SET \"quote\" = ?, \"updated_at\" = ? WHERE \"quotes\".\"id\" = ?",
          "name": "Quote Update",
          "binds": "Not JSON Encodable",
          "type_casted_binds": [
            "Just as one spoils the stomach by overfeeding and thereby impairs the whole body, so can one overload and choke the mind by giving it too much nourishment. For the more one reads the fewer are the traces left of what one has read; the mind is like a tablet that has been written over and over. Hence it is impossible to reflect; and it is only by reflection that one can assimilate what one has read. If one reads straight ahead without pondering over it later, what has been read does not take root, but is for the most part lost.",
            "2024-04-27 05:24:19.467424",
            65
          ],
          "statement_name": null,
          "async": false,
          "connection": "Not JSON Encodable",
          "filename": "/home/dejan/src/github.com/dejan/quotes/app/controllers/quotes_controller.rb",
          "line": 40,
          "method": "block in update"
        },
        "time": 1714195459467.736,
        "transaction_id": "cddc5762136011526a25",
        "end": 1714195459468.8564,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 1.1202409999999998
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/dejan/quotes/app/controllers/quotes_controller.rb",
          "line": 40,
          "method": "block in update",
          "message": "  \u001b[1m\u001b[36mQuote Update (1.5ms)\u001b[0m  \u001b[1m\u001b[33mUPDATE \"quotes\" SET \"quote\" = ?, \"updated_at\" = ? WHERE \"quotes\".\"id\" = ?\u001b[0m  [[\"quote\", \"Just as one spoils the stomach by overfeeding and thereby impairs the whole body, so can one overload and choke the mind by giving it too much nourishment. For the more one reads the fewer are the traces left of what one has read; the mind is like a tablet that has been written over and over. Hence it is impossible to reflect; and it is only by reflection that one can assimilate what one has read. If one reads straight ahead without pondering over it later, what has been read does not take root, but is for the most part lost.\"], [\"updated_at\", \"2024-04-27 05:24:19.467424\"], [\"id\", 65]]",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/dejan/quotes/app/controllers/quotes_controller.rb",
          "line": 40,
          "method": "block in update",
          "message": "  ↳ app/controllers/quotes_controller.rb:40:in `block in update'",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "sql.active_record",
        "payload": {
          "sql": "commit transaction",
          "name": "TRANSACTION",
          "binds": [
            
          ],
          "type_casted_binds": [
            
          ],
          "statement_name": null,
          "async": false,
          "connection": "Not JSON Encodable",
          "filename": "/home/dejan/src/github.com/dejan/quotes/app/controllers/quotes_controller.rb",
          "line": 40,
          "method": "block in update"
        },
        "time": 1714195459470.0083,
        "transaction_id": "cddc5762136011526a25",
        "end": 1714195459470.068,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.059803
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/dejan/quotes/app/controllers/quotes_controller.rb",
          "line": 40,
          "method": "block in update",
          "message": "  \u001b[1m\u001b[36mTRANSACTION (0.2ms)\u001b[0m  \u001b[1m\u001b[36mcommit transaction\u001b[0m",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/dejan/quotes/app/controllers/quotes_controller.rb",
          "line": 40,
          "method": "block in update",
          "message": "  ↳ app/controllers/quotes_controller.rb:40:in `block in update'",
          "level": "debug"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "meta_request.log",
        "payload": {
          "filename": "/home/dejan/src/github.com/dejan/quotes/app/controllers/quotes_controller.rb",
          "line": 41,
          "method": "block (2 levels) in update",
          "message": null,
          "level": "info"
        },
        "time": 0.0,
        "transaction_id": 0,
        "end": 0.0,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 0.0
      },
      {
        "name": "process_action.action_controller",
        "payload": {
          "controller": "QuotesController",
          "action": "update",
          "request": "Not JSON Encodable",
          "params": {
            "_method": "patch",
            "authenticity_token": "[FILTERED]",
            "quote": {
              "author": "schopenhauer",
              "quote": "Just as one spoils the stomach by overfeeding and thereby impairs the whole body, so can one overload and choke the mind by giving it too much nourishment. For the more one reads the fewer are the traces left of what one has read; the mind is like a tablet that has been written over and over. Hence it is impossible to reflect; and it is only by reflection that one can assimilate what one has read. If one reads straight ahead without pondering over it later, what has been read does not take root, but is for the most part lost."
            },
            "commit": "Update Quote",
            "controller": "quotes",
            "action": "update",
            "id": "65"
          },
          "headers": {
            "SCRIPT_NAME": "",
            "QUERY_STRING": "",
            "SERVER_SOFTWARE": "puma 6.4.2 The Eagle of Durango",
            "GATEWAY_INTERFACE": "CGI/1.2",
            "REQUEST_METHOD": "PATCH",
            "REQUEST_PATH": "/quotes/65",
            "REQUEST_URI": "/quotes/65",
            "SERVER_PROTOCOL": "HTTP/1.1",
            "HTTP_HOST": "localhost:3000",
            "HTTP_CONNECTION": "keep-alive",
            "CONTENT_LENGTH": "729",
            "HTTP_SEC_CH_UA": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
            "HTTP_DNT": "1",
            "HTTP_X_CSRF_TOKEN": "oW99MjFZ6zUnB54j7C3dTKwKSRNxSoVuHooD-iv-Z4vnR2bacdXDl2Qj0VGfoht5Qf6SLc5GMlpzDzbEfeNZMw",
            "HTTP_SEC_CH_UA_MOBILE": "?0",
            "HTTP_USER_AGENT": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "CONTENT_TYPE": "application/x-www-form-urlencoded;charset=UTF-8",
            "HTTP_ACCEPT": "text/vnd.turbo-stream.html, text/html, application/xhtml+xml",
            "HTTP_X_TURBO_REQUEST_ID": "5c5bb028-5195-4077-ac20-35ddaac0e533",
            "HTTP_SEC_CH_UA_PLATFORM": "\"Linux\"",
            "HTTP_ORIGIN": "http://localhost:3000",
            "HTTP_SEC_FETCH_SITE": "same-origin",
            "HTTP_SEC_FETCH_MODE": "cors",
            "HTTP_SEC_FETCH_DEST": "empty",
            "HTTP_REFERER": "http://localhost:3000/quotes/65/edit",
            "HTTP_ACCEPT_ENCODING": "gzip, deflate, br, zstd",
            "HTTP_ACCEPT_LANGUAGE": "en-US,en;q=0.9,hr;q=0.8,bs;q=0.7",
            "HTTP_COOKIE": "_hellorailsworld_session=J1hYo%2Ba7Sy%2BrLH2PKwkBEAEHuOPH70jG6AduSymroVy6kA9jrDWvMQmG4J5InAEk%2BNb6gVR%2BeBB1O5KQ3kW2MuDybbWOvS8uc%2FjTBf1eDDiQzRFbvIgBwnkkaubu%2FA9Wmu3s6xmk2fUsrMSAs7vF8lqAMlUuEcAZuRTZBZ5ok610K1wxCIH6NK6SJzGlwLZtUSZj3Z7Xfzsf%2Bj%2FaQEWI6hygNMis%2F5yRp8JacpCR41GjqpM72pUqorPd46GAYSi57RSQZVuX4cS8QBVUeS5fOigbhy8chYh3wgWJFQyJyv8%3D--2aMwTR1Yuyq94GxC--FJ2i22dxdzl4WIDehgn%2F1A%3D%3D; _quotes_session=iX3sUVGRJ%2Bx1u8EJ9Mc%2FhjxCg1sD8USIHDuZxoJN9SGnFX%2FxjSHqB4NWRzjSZTTTbGdk269x6TkuYld693kdufYplyetrTON9qqIaoTL7vpm4xx4LH6f8etscfP51Xvwsud5XTj0zzq9YWyTKaJ9IjK3mULawTeNT7D0cSY3gA6p2TVXl02LMXA1Wr1FB4InAZjx2OwRZM6Q0LTVgi6lcAVWxZG42V%2BnD6BzpOvYopOOWLj5bxJ48I2glU2Nyt5Q7kwbVsW%2FaiCR1xpDm6U02Q6bLSjFEHY%3D--RQQzQXfgVQEmo0zn--Dd8O11O8WbKGx7BLhZ%2FcLA%3D%3D",
            "SERVER_NAME": "localhost",
            "SERVER_PORT": "3000",
            "PATH_INFO": "/quotes/65",
            "REMOTE_ADDR": "::1",
            "HTTP_VERSION": "HTTP/1.1",
            "ROUTES_11320_SCRIPT_NAME": "",
            "ORIGINAL_FULLPATH": "/quotes/65",
            "ORIGINAL_SCRIPT_NAME": ""
          },
          "format": "turbo_stream",
          "method": "PATCH",
          "path": "/quotes/65",
          "response": "Not JSON Encodable",
          "status": 302,
          "view_runtime": null,
          "db_runtime": 1.2642820365726948
        },
        "time": 1714195459465.4858,
        "transaction_id": "cddc5762136011526a25",
        "end": 1714195459471.2656,
        "cpu_time_start": 0.0,
        "cpu_time_finish": 0.0,
        "allocation_count_start": 0,
        "allocation_count_finish": 0,
        "duration": 5.779743000000001
      }
    ]
  }
]

const SHOW_FAST_ID = '31fc50ed-3d47-4d5c-9d54-2683b1b4a791'
const SHOW_SLOW_ID = 'c4d5e6f7-8901-4a2b-9c3d-4e5f60718293'
const THUMBNAIL_ID = 'a8e3f2c1-4b5d-4e6f-8a9b-0c1d2e3f4a5b'
const HELLO_ID = '1860f1f3-a7a7-41b0-a2f3-a1bca089bb6d'
const UPDATE_FAST_ID = '5e77aac7-aeae-460d-a6f8-424b93bbd5d2'
const UPDATE_SLOW_ID = 'd5e6f7a8-9012-4b3c-8d4e-5f6071829304'
const POSTS_FILTER_PLAIN_ID = 'c0d1e2f3-4567-4a70-b293-041526374859'
const POSTS_FILTER_STATUS_ID = 'd1e2f3a4-5678-4b71-c304-152637485960'
const POSTS_N1_ID = 'e6f7a8b9-0123-4c4d-9e5f-607182930415'
const POSTS_CREATE_OK_ID = 'f7a8b9c0-1234-4d5e-8f60-718293041526'
const POSTS_CREATE_422_ID = 'a8b9c0d1-2345-4e5f-9071-829304152637'
const KITCHEN_SINK_ID = 'b9c0d1e2-3456-4f60-a182-930415263748'

/** Stable ids for standalone Compare seed (posts index filter ≈ SQL / F?). */
export const DEMO_COMPARE_IDS = { a: POSTS_FILTER_PLAIN_ID, b: POSTS_FILTER_STATUS_ID }

const byId = Object.fromEntries(capturedRequests.map((r) => [r.request_id, r]))

const showFast = byId[SHOW_FAST_ID]
const showSlow = patchProcessAction(
  injectSqlEvents(
    scaleTimedEvents(withRequestId(showFast, SHOW_SLOW_ID), 3.5),
    [
      makeSqlEvent({
        sql: 'SELECT "versions".* FROM "versions" WHERE "versions"."item_type" = $1 AND "versions"."item_id" = $2 ORDER BY "versions"."created_at" DESC',
        name: 'Version Load',
        duration: 4.2,
        binds: ['Diagram', 93],
        time: 1713308146488,
        filename: '/home/dejan/src/github.com/diagrammatic/diagrammatic/app/models/diagram.rb',
        line: 40,
        method: 'versions',
      }),
      makeSqlEvent({
        sql: 'SELECT "collaborators".* FROM "collaborators" WHERE "collaborators"."diagram_id" = $1',
        name: 'Collaborator Load',
        duration: 3.1,
        binds: [93],
        time: 1713308146492,
        filename: '/home/dejan/src/github.com/diagrammatic/diagrammatic/app/controllers/diagrams_controller.rb',
        line: 35,
        method: 'show',
      }),
    ]
  ),
  {
    path: '/diagrams/x9SlowCompare',
    params: { id: 'x9SlowCompare' },
  }
)

const updateFast = byId[UPDATE_FAST_ID]
const updateSlow = patchProcessAction(
  injectSqlEvents(
    scaleTimedEvents(withRequestId(updateFast, UPDATE_SLOW_ID), 4),
    [
      makeSqlEvent({
        sql: 'SELECT "audit_logs".* FROM "audit_logs" WHERE "audit_logs"."quote_id" = ? ORDER BY "audit_logs"."id" DESC LIMIT ?',
        name: 'AuditLog Load',
        duration: 2.8,
        binds: [65, 10],
        time: 1714195459468,
        filename: '/home/dejan/src/github.com/dejan/quotes/app/controllers/quotes_controller.rb',
        line: 45,
        method: 'update',
      }),
      makeSqlEvent({
        sql: 'INSERT INTO "audit_logs" ("quote_id", "action", "created_at", "updated_at") VALUES (?, ?, ?, ?)',
        name: 'AuditLog Create',
        duration: 1.6,
        binds: [65, 'update', '2024-04-27', '2024-04-27'],
        time: 1714195459470,
        filename: '/home/dejan/src/github.com/dejan/quotes/app/controllers/quotes_controller.rb',
        line: 46,
        method: 'update',
      }),
    ]
  ),
  {
    path: '/quotes/99',
    params: { id: '99' },
  }
)

/** Compare pair: same Posts#index shape, B adds status filter → ≈ SQL + F?. */
const filterPlainTime = 1715000000500
const postsFilterPlain = makeRequest(POSTS_FILTER_PLAIN_ID, [
  makeSqlEvent({
    sql: 'SELECT "posts".* FROM "posts" ORDER BY "posts"."created_at" DESC LIMIT $1',
    name: 'Post Load',
    duration: 1.8,
    binds: [20],
    time: filterPlainTime,
    filename: '/app/controllers/posts_controller.rb',
    line: 8,
    method: 'index',
    transactionId: 'posts-filter-plain-tx',
  }),
  makeViewEvent({
    kind: 'template',
    identifier: '/app/views/posts/index.html.erb',
    layout: 'layouts/application',
    duration: 4.2,
    time: filterPlainTime + 3,
    transactionId: 'posts-filter-plain-tx',
  }),
  makeProcessAction({
    controller: 'PostsController',
    action: 'index',
    method: 'GET',
    path: '/posts',
    status: 200,
    format: 'html',
    params: { page: '1' },
    duration: 18,
    dbRuntime: 1.8,
    viewRuntime: 4.2,
    time: filterPlainTime,
    transactionId: 'posts-filter-plain-tx',
  }),
])

const filterStatusTime = 1715000000800
const postsFilterStatus = makeRequest(POSTS_FILTER_STATUS_ID, [
  makeSqlEvent({
    sql: 'SELECT "posts".* FROM "posts" WHERE "posts"."status" = $1 ORDER BY "posts"."created_at" DESC LIMIT $2',
    name: 'Post Load',
    duration: 2.6,
    binds: ['published', 20],
    time: filterStatusTime,
    filename: '/app/controllers/posts_controller.rb',
    line: 8,
    method: 'index',
    transactionId: 'posts-filter-status-tx',
  }),
  makeViewEvent({
    kind: 'template',
    identifier: '/app/views/posts/index.html.erb',
    layout: 'layouts/application',
    duration: 4.0,
    time: filterStatusTime + 4,
    transactionId: 'posts-filter-status-tx',
  }),
  makeProcessAction({
    controller: 'PostsController',
    action: 'index',
    method: 'GET',
    path: '/posts',
    status: 200,
    format: 'html',
    params: { page: '1', status: 'published' },
    duration: 22,
    dbRuntime: 2.6,
    viewRuntime: 4.0,
    time: filterStatusTime,
    transactionId: 'posts-filter-status-tx',
  }),
])

const n1BaseTime = 1715000000000
const postsNPlusOne = makeRequest(POSTS_N1_ID, [
  makeSqlEvent({
    sql: 'SELECT "posts".* FROM "posts" ORDER BY "posts"."created_at" DESC LIMIT $1',
    name: 'Post Load',
    duration: 2.4,
    binds: [10],
    time: n1BaseTime,
    filename: '/app/controllers/posts_controller.rb',
    line: 8,
    method: 'index',
    transactionId: 'n1-tx',
  }),
  ...[1, 2, 3, 4].flatMap((id, i) => [
    makeSqlEvent({
      sql: 'SELECT "comments".* FROM "comments" WHERE "comments"."post_id" = $1',
      name: 'Comment Load',
      duration: 0.9 + i * 0.15,
      binds: [id],
      time: n1BaseTime + 10 + i * 4,
      filename: '/app/models/post.rb',
      line: 12,
      method: 'comments',
      transactionId: 'n1-tx',
    }),
    makeSqlEvent({
      sql: 'SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT $2',
      name: 'User Load',
      duration: 0.55 + i * 0.1,
      binds: [id, 1],
      time: n1BaseTime + 12 + i * 4,
      filename: '/app/models/post.rb',
      line: 16,
      method: 'author',
      transactionId: 'n1-tx',
    }),
  ]),
  makeProcessAction({
    controller: 'PostsController',
    action: 'index',
    method: 'GET',
    path: '/posts',
    status: 200,
    format: 'html',
    duration: 48,
    dbRuntime: 18.5,
    viewRuntime: 22,
    time: n1BaseTime,
    transactionId: 'n1-tx',
  }),
])

const createOkTime = 1715000001000
const postsCreateOk = makeRequest(POSTS_CREATE_OK_ID, [
  makeSqlEvent({
    sql: 'BEGIN',
    name: 'TRANSACTION',
    duration: 0.05,
    binds: [],
    time: createOkTime,
    filename: '/app/controllers/posts_controller.rb',
    line: 22,
    method: 'create',
    transactionId: 'create-ok-tx',
  }),
  makeSqlEvent({
    sql: 'INSERT INTO "posts" ("title", "body", "user_id", "created_at", "updated_at") VALUES ($1, $2, $3, $4, $5) RETURNING "id"',
    name: 'Post Create',
    duration: 1.8,
    binds: ['Hello', 'World', 1, '2024-05-01', '2024-05-01'],
    time: createOkTime + 1,
    filename: '/app/controllers/posts_controller.rb',
    line: 24,
    method: 'create',
    transactionId: 'create-ok-tx',
  }),
  makeSqlEvent({
    sql: 'COMMIT',
    name: 'TRANSACTION',
    duration: 0.08,
    binds: [],
    time: createOkTime + 3,
    filename: '/app/controllers/posts_controller.rb',
    line: 24,
    method: 'create',
    transactionId: 'create-ok-tx',
  }),
  makeProcessAction({
    controller: 'PostsController',
    action: 'create',
    method: 'POST',
    path: '/posts',
    status: 201,
    format: 'html',
    params: { post: { title: 'Hello', body: 'World', status: 'draft' } },
    duration: 12,
    dbRuntime: 2.1,
    viewRuntime: 0,
    time: createOkTime,
    transactionId: 'create-ok-tx',
  }),
])

const create422Time = 1715000002000
const postsCreate422 = makeRequest(POSTS_CREATE_422_ID, [
  makeSqlEvent({
    sql: 'SELECT 1 AS one FROM "posts" WHERE "posts"."title" = $1 LIMIT $2',
    name: 'Post Exists?',
    duration: 0.4,
    binds: ['', 1],
    time: create422Time,
    filename: '/app/models/post.rb',
    line: 5,
    method: 'validate',
    transactionId: 'create-422-tx',
  }),
  ...makeSqlDebugLogs({
    filename: '/app/models/post.rb',
    line: 5,
    method: 'validate',
    typeName: 'Post Exists?',
    durationMs: 0.4,
    sql: 'SELECT 1 AS one FROM "posts" WHERE "posts"."title" = $1 LIMIT $2',
    bindPairs: [['title', ''], ['LIMIT', 1]],
  }),
  makeViewEvent({
    kind: 'partial',
    identifier: '/app/views/posts/_form.html.erb',
    duration: 1.8,
    time: create422Time + 2,
    transactionId: 'create-422-tx',
    locals: { post: 'Not JSON Encodable' },
  }),
  makeViewEvent({
    kind: 'template',
    identifier: '/app/views/posts/new.html.erb',
    layout: 'layouts/application',
    duration: 4.2,
    time: create422Time + 1,
    transactionId: 'create-422-tx',
  }),
  makeProcessAction({
    controller: 'PostsController',
    action: 'create',
    method: 'POST',
    path: '/posts',
    status: 422,
    format: 'html',
    params: { post: { title: '', body: 'World', status: 'draft' } },
    duration: 8,
    dbRuntime: 0.4,
    viewRuntime: 4.2,
    time: create422Time,
    transactionId: 'create-422-tx',
    exception: [
      'ActiveRecord::RecordInvalid',
      "Validation failed: Title can't be blank, Body can't be blank",
    ],
  }),
  ...makeExceptionEvents({
    klass: 'ActiveRecord::RecordInvalid',
    message: "Validation failed: Title can't be blank, Body can't be blank",
    frames: [
      "app/models/post.rb:12:in `save!'",
      "app/models/post.rb:18:in `create!'",
      "app/controllers/posts_controller.rb:28:in `create'",
      "actionpack (7.1.3) lib/action_controller/metal/basic_implicit_render.rb:6:in `send_action'",
      "actionpack (7.1.3) lib/abstract_controller/base.rb:224:in `process_action'",
      "actionpack (7.1.3) lib/action_controller/metal/rendering.rb:165:in `process_action'",
      "actionpack (7.1.3) lib/abstract_controller/callbacks.rb:259:in `block in process_action'",
      "activesupport (7.1.3) lib/active_support/callbacks.rb:121:in `block in run_callbacks'",
      "actionpack (7.1.3) lib/action_controller/metal/rescue.rb:25:in `call'",
      "actionpack (7.1.3) lib/action_controller/metal/instrumentation.rb:74:in `block in process_action'",
      "activesupport (7.1.3) lib/active_support/notifications.rb:206:in `block in instrument'",
      "actionpack (7.1.3) lib/action_controller/metal/params_wrapper.rb:261:in `process_action'",
    ],
  }),
])

/** Kitchen-sink request: DB + views + cache + logs + exception (all detail tabs). */
const kitchenSinkTime = 1715000003000
const kitchenSinkTx = 'kitchen-sink-tx'
const kitchenSink = makeRequest(KITCHEN_SINK_ID, [
  makeSqlEvent({
    sql: 'SELECT "orders".* FROM "orders" WHERE "orders"."id" = $1 LIMIT $2',
    name: 'Order Load',
    duration: 1.4,
    binds: [42, 1],
    time: kitchenSinkTime,
    filename: '/app/controllers/orders_controller.rb',
    line: 48,
    method: 'checkout',
    transactionId: kitchenSinkTx,
  }),
  ...makeSqlDebugLogs({
    filename: '/app/controllers/orders_controller.rb',
    line: 48,
    method: 'checkout',
    typeName: 'Order Load',
    durationMs: 1.4,
    sql: 'SELECT "orders".* FROM "orders" WHERE "orders"."id" = $1 LIMIT $2',
    bindPairs: [['id', 42], ['LIMIT', 1]],
  }),
  makeSqlEvent({
    sql: 'SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT $2',
    name: 'User Load',
    duration: 0.7,
    binds: [7, 1],
    time: kitchenSinkTime + 2,
    filename: '/app/controllers/orders_controller.rb',
    line: 49,
    method: 'checkout',
    transactionId: kitchenSinkTx,
  }),
  ...makeSqlDebugLogs({
    filename: '/app/controllers/orders_controller.rb',
    line: 49,
    method: 'checkout',
    typeName: 'User Load',
    durationMs: 0.7,
    sql: 'SELECT "users".* FROM "users" WHERE "users"."id" = $1 LIMIT $2',
    bindPairs: [['id', 7], ['LIMIT', 1]],
  }),
  makeSqlEvent({
    sql: 'SELECT "line_items".* FROM "line_items" WHERE "line_items"."order_id" = $1',
    name: 'LineItem Load',
    duration: 2.1,
    binds: [42],
    time: kitchenSinkTime + 3,
    filename: '/app/models/order.rb',
    line: 22,
    method: 'line_items',
    transactionId: kitchenSinkTx,
  }),
  ...makeSqlDebugLogs({
    filename: '/app/models/order.rb',
    line: 22,
    method: 'line_items',
    typeName: 'LineItem Load',
    durationMs: 2.1,
    sql: 'SELECT "line_items".* FROM "line_items" WHERE "line_items"."order_id" = $1',
    bindPairs: [['order_id', 42]],
  }),
  makeSqlEvent({
    sql: 'SELECT "products".* FROM "products" WHERE "products"."id" = $1 LIMIT $2',
    name: 'Product Load',
    duration: 0.85,
    binds: [101, 1],
    time: kitchenSinkTime + 6,
    filename: '/app/models/line_item.rb',
    line: 10,
    method: 'product',
    transactionId: kitchenSinkTx,
  }),
  ...makeSqlDebugLogs({
    filename: '/app/models/line_item.rb',
    line: 10,
    method: 'product',
    typeName: 'Product Load',
    durationMs: 0.9,
    sql: 'SELECT "products".* FROM "products" WHERE "products"."id" = $1 LIMIT $2',
    bindPairs: [['id', 101], ['LIMIT', 1]],
  }),
  makeSqlEvent({
    sql: 'SELECT "products".* FROM "products" WHERE "products"."id" = $1 LIMIT $2',
    name: 'Product Load',
    duration: 0.72,
    binds: [102, 1],
    time: kitchenSinkTime + 7,
    filename: '/app/models/line_item.rb',
    line: 10,
    method: 'product',
    transactionId: kitchenSinkTx,
  }),
  ...makeSqlDebugLogs({
    filename: '/app/models/line_item.rb',
    line: 10,
    method: 'product',
    typeName: 'Product Load',
    durationMs: 0.7,
    sql: 'SELECT "products".* FROM "products" WHERE "products"."id" = $1 LIMIT $2',
    bindPairs: [['id', 102], ['LIMIT', 1]],
  }),
  makeSqlEvent({
    sql: 'SELECT "products".* FROM "products" WHERE "products"."id" = $1 LIMIT $2',
    name: 'Product Load',
    duration: 0.91,
    binds: [103, 1],
    time: kitchenSinkTime + 8,
    filename: '/app/models/line_item.rb',
    line: 10,
    method: 'product',
    transactionId: kitchenSinkTx,
  }),
  ...makeSqlDebugLogs({
    filename: '/app/models/line_item.rb',
    line: 10,
    method: 'product',
    typeName: 'Product Load',
    durationMs: 0.9,
    sql: 'SELECT "products".* FROM "products" WHERE "products"."id" = $1 LIMIT $2',
    bindPairs: [['id', 103], ['LIMIT', 1]],
  }),
  makeCacheEvent({
    type: 'read',
    key: 'shipping/rates/br-sp',
    hit: false,
    duration: 0.12,
    time: kitchenSinkTime + 10,
    transactionId: kitchenSinkTx,
    filename: '/app/services/shipping_calculator.rb',
    line: 14,
    method: 'rates_for',
  }),
  makeCacheEvent({
    type: 'write',
    key: 'shipping/rates/br-sp',
    duration: 0.18,
    time: kitchenSinkTime + 14,
    transactionId: kitchenSinkTx,
    filename: '/app/services/shipping_calculator.rb',
    line: 22,
    method: 'rates_for',
  }),
  makeCacheEvent({
    type: 'read',
    key: 'tax/rules/2024',
    hit: true,
    duration: 0.04,
    time: kitchenSinkTime + 15,
    transactionId: kitchenSinkTx,
    filename: '/app/services/tax_calculator.rb',
    line: 8,
    method: 'rules',
  }),
  makeCacheEvent({
    type: 'exist',
    key: 'orders/42/invoice-preview',
    duration: 0.03,
    time: kitchenSinkTime + 16,
    transactionId: kitchenSinkTx,
    filename: '/app/controllers/orders_controller.rb',
    line: 55,
    method: 'checkout',
  }),
  makeViewEvent({
    kind: 'partial',
    identifier: '/app/views/orders/checkout/_line_item.html.erb',
    duration: 1.2,
    time: kitchenSinkTime + 20,
    transactionId: kitchenSinkTx,
    locals: { line_item: 'Not JSON Encodable' },
  }),
  makeViewEvent({
    kind: 'partial',
    identifier: '/app/views/orders/checkout/_line_item.html.erb',
    duration: 0.9,
    time: kitchenSinkTime + 22,
    transactionId: kitchenSinkTx,
    locals: { line_item: 'Not JSON Encodable' },
  }),
  makeViewEvent({
    kind: 'partial',
    identifier: '/app/views/orders/checkout/_summary.html.erb',
    duration: 2.4,
    time: kitchenSinkTime + 24,
    transactionId: kitchenSinkTx,
  }),
  makeViewEvent({
    kind: 'partial',
    identifier: '/app/views/shared/_flash.html.erb',
    duration: 0.35,
    time: kitchenSinkTime + 27,
    transactionId: kitchenSinkTx,
    cacheHit: true,
  }),
  makeViewEvent({
    kind: 'template',
    identifier: '/app/views/orders/checkout.html.erb',
    layout: 'layouts/application',
    duration: 8.6,
    time: kitchenSinkTime + 18,
    transactionId: kitchenSinkTx,
  }),
  makeProcessAction({
    controller: 'OrdersController',
    action: 'checkout',
    method: 'POST',
    path: '/orders/42/checkout',
    status: 500,
    format: 'html',
    params: {
      id: '42',
      order: { payment_method: 'card', coupon: 'SAVE10' },
      authenticity_token: '[FILTERED]',
    },
    duration: 86,
    dbRuntime: 7.6,
    viewRuntime: 14.5,
    time: kitchenSinkTime,
    transactionId: kitchenSinkTx,
    exception: [
      'Payments::CardDeclined',
      'card was declined (code: card_declined)',
    ],
  }),
  ...makeExceptionEvents({
    klass: 'Payments::CardDeclined',
    message: 'card was declined (code: card_declined)',
    frames: [
      "app/services/payment_gateway.rb:64:in `charge'",
      "app/services/payment_gateway.rb:41:in `block in charge'",
      "app/services/checkout.rb:31:in `process!'",
      "app/services/checkout.rb:18:in `call'",
      "app/controllers/orders_controller.rb:72:in `checkout'",
      "actionpack (7.1.3) lib/action_controller/metal/basic_implicit_render.rb:6:in `send_action'",
      "actionpack (7.1.3) lib/abstract_controller/base.rb:224:in `process_action'",
      "actionpack (7.1.3) lib/action_controller/metal/rendering.rb:165:in `process_action'",
      "actionpack (7.1.3) lib/abstract_controller/callbacks.rb:259:in `block in process_action'",
      "activesupport (7.1.3) lib/active_support/callbacks.rb:121:in `block in run_callbacks'",
      "actionpack (7.1.3) lib/action_controller/metal/rescue.rb:25:in `call'",
      "actionpack (7.1.3) lib/action_controller/metal/instrumentation.rb:74:in `block in process_action'",
    ],
  }),
])

/**
 * Standalone demo requests:
 * show fast/slow, posts filter plain/status (Compare ≈ SQL / F?),
 * thumbnail 500, hello cache, update fast/slow, posts N+1,
 * create 201/422, kitchen-sink (all tabs).
 */
export const fakeEvents = [
  showFast,
  showSlow,
  postsFilterPlain,
  postsFilterStatus,
  byId[THUMBNAIL_ID],
  byId[HELLO_ID],
  updateFast,
  updateSlow,
  postsNPlusOne,
  postsCreateOk,
  postsCreate422,
  kitchenSink,
]
