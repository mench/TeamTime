var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("config/index", ["require", "exports"], function (require, exports) {
    "use strict";
    var Config = (function () {
        function Config() {
        }
        return Config;
    }());
    exports.Config = Config;
});
define("utils/cached", ["require", "exports"], function (require, exports) {
    "use strict";
    function Cached(target, key, desc) {
        var initializer = desc.get;
        desc.get = function () {
            return Object.defineProperty(this, key, {
                value: initializer.call(this)
            })[key];
        };
        return desc;
    }
    exports.Cached = Cached;
});
define("helpers/logger", ["require", "exports", "dependency-injection.ts", "winston", "config/index"], function (require, exports, dependency_injection_ts_1, winston, index_1) {
    "use strict";
    exports.LEVEL = {
        ERROR: 'verbose',
        INFO: 'info',
        VERBOSE: 'verbose',
        DEBUG: 'debug',
        WARN: 'warn'
    };
    var LogHelper = (function () {
        function LogHelper() {
            var logger = this.config.logger;
            winston.remove(winston.transports.Console);
            winston.add(winston.transports.Console, {
                colorize: true,
                timestamp: function () {
                    var date = new Date();
                    return date.getDate() + '/' + (date.getMonth() + 1) + ' ' + date.toTimeString().substr(0, 5) + ' [' + global.process.pid + ']';
                },
                level: logger.level,
                json: logger.json,
                stringify: logger.stringify
            });
            this.logger = winston;
        }
        return LogHelper;
    }());
    __decorate([
        dependency_injection_ts_1.inject,
        __metadata("design:type", index_1.Config)
    ], LogHelper.prototype, "config", void 0);
    LogHelper = __decorate([
        dependency_injection_ts_1.singleton,
        __metadata("design:paramtypes", [])
    ], LogHelper);
    function Logger(target, key) {
        return {
            enumerable: true,
            configurable: true,
            get: function () {
                return Object.defineProperty(this, key, {
                    enumerable: true,
                    configurable: true,
                    value: dependency_injection_ts_1.container.getInstanceOf(LogHelper).logger
                })[key];
            }
        };
    }
    exports.Logger = Logger;
});
define("components/hello", ["require", "exports", "react", "react"], function (require, exports, React, react_1) {
    "use strict";
    var Hello = (function (_super) {
        __extends(Hello, _super);
        function Hello() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Hello.prototype.render = function () {
            return (React.createElement("div", null,
                React.createElement("h1", null, "Hello1")));
        };
        return Hello;
    }(react_1.Component));
    exports.Hello = Hello;
});
define("components/view", ["require", "exports", "react", "react-dom", "components/hello", "dependency-injection.ts"], function (require, exports, React, ReactDOM, hello_1, dependency_injection_ts_2) {
    "use strict";
    var View = (function () {
        function View() {
        }
        View.prototype.render = function () {
            ReactDOM.render(React.createElement(hello_1.Hello, null), document.getElementById('app'));
        };
        return View;
    }());
    View = __decorate([
        dependency_injection_ts_2.singleton
    ], View);
    exports.View = View;
});
define("config/local", ["require", "exports", "config/index", "dependency-injection.ts", "helpers/logger"], function (require, exports, index_2, dependency_injection_ts_3, logger_1) {
    "use strict";
    var LocalConfig = (function (_super) {
        __extends(LocalConfig, _super);
        function LocalConfig() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.logger = {
                level: logger_1.LEVEL.DEBUG,
                json: false,
                stringify: false
            };
            return _this;
        }
        return LocalConfig;
    }(index_2.Config));
    LocalConfig = __decorate([
        dependency_injection_ts_3.singleton
    ], LocalConfig);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LocalConfig;
});
define("system", ["require", "exports", "dependency-injection.ts", "config/index", "utils/cached", "helpers/logger", "components/view", "config/local"], function (require, exports, dependency_injection_ts_4, index_3, cached_1, logger_2, view_1, local_1) {
    "use strict";
    var System = System_1 = (function () {
        function System() {
        }
        Object.defineProperty(System, "loadConfig", {
            get: function () {
                return local_1.default;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(System, "app", {
            get: function () {
                dependency_injection_ts_4.container.bind(index_3.Config, this.loadConfig);
                return dependency_injection_ts_4.container
                    .getInstanceOf(System_1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(System, "env", {
            get: function () {
                return process.env.NODE_ENV || 'local';
            },
            enumerable: true,
            configurable: true
        });
        ;
        System.prototype.start = function () {
            this.log.info("System Starting");
            this.view.render();
        };
        return System;
    }());
    __decorate([
        logger_2.Logger,
        __metadata("design:type", Object)
    ], System.prototype, "log", void 0);
    __decorate([
        dependency_injection_ts_4.inject,
        __metadata("design:type", index_3.Config)
    ], System.prototype, "config", void 0);
    __decorate([
        dependency_injection_ts_4.inject,
        __metadata("design:type", view_1.View)
    ], System.prototype, "view", void 0);
    __decorate([
        cached_1.Cached,
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], System, "loadConfig", null);
    __decorate([
        cached_1.Cached,
        __metadata("design:type", System),
        __metadata("design:paramtypes", [])
    ], System, "app", null);
    __decorate([
        cached_1.Cached,
        __metadata("design:type", String),
        __metadata("design:paramtypes", [])
    ], System, "env", null);
    System = System_1 = __decorate([
        dependency_injection_ts_4.singleton
    ], System);
    exports.System = System;
    System.app.start();
    var System_1;
});
//# sourceMappingURL=bundle.js.map