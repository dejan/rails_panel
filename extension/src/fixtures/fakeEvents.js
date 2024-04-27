export const fakeEvents = [
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
    request_id: "", events: [
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
