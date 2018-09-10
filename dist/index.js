'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var PouchDB = require('pouchdb-core');

var Sync = /** @class */ (function () {
    function Sync() {
        this._subs = [];
        this._subjects = {
            change: new rxjs.Subject(),
            docs: new rxjs.Subject(),
            active: new rxjs.BehaviorSubject(false),
            complete: new rxjs.BehaviorSubject(false),
            error: new rxjs.Subject(),
        };
        this._isListening = false;
        this.change$ = this._subjects.change.asObservable();
        this.docs$ = this._subjects.docs.asObservable();
        this.active$ = this._subjects.active.asObservable();
        this.complete$ = this._subjects.complete.asObservable();
        this.error$ = this._subjects.error.asObservable();
    }
    Sync.prototype.setupListener = function (pouchSync) {
        var _this = this;
        if (this.pouchSync) {
            this.cancel();
        }
        this.pouchSync = pouchSync;
        this._isListening = true;
        // change
        this._subs.push(rxjs.fromEvent(this.pouchSync, 'change').subscribe(function (ev) {
            _this._subjects.change.next(ev);
        }));
        // docs
        this._subs.push(rxjs.fromEvent(this.pouchSync, 'change').subscribe(function (ev) {
            if (_this._subjects.docs.observers.length === 0 || ev.direction !== 'pull')
                return;
            ev.change.docs.forEach(function (doc) { return _this._subjects.docs.next(doc); });
        }));
        // error
        this._subs.push(rxjs.fromEvent(this.pouchSync, 'error').subscribe(function (ev) {
            _this._subjects.error.next(ev);
        }));
        // active
        this._subs.push(rxjs.fromEvent(this.pouchSync, 'active').subscribe(function () {
            _this._subjects.active.next(true);
        }));
        this._subs.push(rxjs.fromEvent(this.pouchSync, 'paused').subscribe(function () {
            _this._subjects.active.next(false);
        }));
        // complete
        this._subs.push(rxjs.fromEvent(this.pouchSync, 'complete').subscribe(function (info) {
            _this._subjects.complete.next(info);
        }));
        this.pouchSync.on('change', function (info) {
            console.log('P:change', info);
        }).on('paused', function (err) {
            console.log('P:paused', err); // replication paused (e.g. replication up to date, user went offline)
        }).on('active', function () {
            console.log('P:active'); // replicate resumed (e.g. new changes replicating, user went back online)
        }).on('denied', function (err) {
            console.log('P:denied', err); // a document failed to replicate (e.g. due to permissions)
        }).on('complete', function (info) {
            console.log('P:complete', info); // handle complete
        }).on('error', function (err) {
            console.log('P:error', err); // handle error
        });
    };
    Sync.prototype.cancel = function () {
        var _this = this;
        this.pouchSync.cancel();
        this.pouchSync = null;
        this._isListening = false;
        // TODO: why need this? isn't cancel() syncronus? does rxdb also need this?
        setTimeout(function () {
            _this._subs.forEach(function (sub) { return sub.unsubscribe(); });
        }, 0);
    };
    return Sync;
}());

var Changes = /** @class */ (function () {
    function Changes() {
        this._subs = [];
        this._subjects = {
            change: new rxjs.Subject(),
            docs: new rxjs.Subject(),
            complete: new rxjs.BehaviorSubject(false),
            error: new rxjs.Subject(),
        };
        this._isListening = false;
        this.change$ = this._subjects.change.asObservable();
        this.complete$ = this._subjects.complete.asObservable();
        this.error$ = this._subjects.error.asObservable();
    }
    Changes.prototype.setupListener = function (pouchChanges) {
        var _this = this;
        if (this.pouchChanges) {
            this.cancel();
        }
        this.pouchChanges = pouchChanges;
        this._isListening = true;
        // change
        this._subs.push(rxjs.fromEvent(this.pouchChanges, 'change').subscribe(function (ev) {
            var op = ev[0].doc._rev.startsWith('1-') ? 'INSERT' : 'UPDATE';
            if (ev[0].doc._deleted)
                op = 'REMOVE';
            ev[0].op = op;
            _this._subjects.change.next(ev[0]);
        }));
        // complete
        this._subs.push(rxjs.fromEvent(this.pouchChanges, 'complete').subscribe(function (info) {
            _this._subjects.complete.next(info);
        }));
        // error
        this._subs.push(rxjs.fromEvent(this.pouchChanges, 'error').subscribe(function (ev) {
            _this._subjects.error.next(ev);
        }));
    };
    Changes.prototype.cancel = function () {
        var _this = this;
        this.pouchChanges.cancel();
        this.pouchChanges = null;
        this._isListening = false;
        setTimeout(function () {
            _this._subs.forEach(function (sub) { return sub.unsubscribe(); });
        }, 0);
    };
    return Changes;
}());

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var Store = /** @class */ (function () {
    function Store(docsSubject) {
        this.docsSubject = docsSubject;
        this.docs = [];
    }
    Store.prototype.setData = function (docs) {
        this.docs = docs;
    };
    Store.prototype.get = function (id) {
        return this.docs.find(function (model) { return model._id === id; });
    };
    Store.prototype.getIndex = function (id) {
        return this.docs.findIndex(function (model) { return model._id === id; });
    };
    Store.prototype.first = function () {
        return this.docs[0];
    };
    Store.prototype.updateInStore = function (model) {
        var found = false;
        var index = this.getIndex(model._id);
        if (index !== -1) {
            this.docs[index] = model;
            found = true;
        }
        this.docsSubject.next(this.docs);
        return found;
    };
    Store.prototype.addToStore = function (model) {
        this.docs.push(model);
        this.docsSubject.next(this.docs);
    };
    Store.prototype.removeFromStore = function (id) {
        var found = false;
        var index = this.getIndex(id);
        if (index !== -1) {
            this.docs.splice(index, 1);
            found = true;
        }
        this.docsSubject.next(this.docs);
        return found;
    };
    return Store;
}());

var EHook;
(function (EHook) {
    EHook["PRE_CREATE"] = "preCreate";
    EHook["POST_CREATE"] = "postCreate";
    EHook["PRE_UPDATE"] = "preUpdate";
    EHook["POST_UPDATE"] = "postUpdate";
    EHook["PRE_SAVE"] = "preSave";
    EHook["POST_SAVE"] = "postSave";
    EHook["PRE_REMOVE"] = "preRemove";
    EHook["POST_REMOVE"] = "postRemove";
})(EHook || (EHook = {}));
var Hook = /** @class */ (function () {
    function Hook() {
        this.preCreate = null;
        this.postCreate = null;
        this.preUpdate = null;
        this.postUpdate = null;
        this.preSave = null;
        this.postSave = null;
        this.preRemove = null;
        this.postRemove = null;
    }
    Hook.prototype.addHook = function (hookName, fn) {
        if (!this[hookName]) {
            this[hookName] = [];
        }
        this.preCreate.push(fn);
    };
    Hook.prototype.runHooks = function (hookName, doc) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, fn;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this[hookName])
                            return [2 /*return*/, doc];
                        _i = 0, _a = this[hookName];
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        fn = _a[_i];
                        return [4 /*yield*/, fn(doc)];
                    case 2:
                        doc = _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, doc];
                }
            });
        });
    };
    return Hook;
}());

var Collection = /** @class */ (function () {
    // setFilter(observable)
    // option 1 run through all docs, on change
    // option 2 run the change on through filter and append or remove docs | requires 3 subscriptions/but still need to sort
    // todo change user to observable
    // todo https://stackoverflow.com/questions/35743426/async-constructor-functions-in-typescript
    function Collection(_pouchdb, _allChanges$, _docType, _user) {
        var _this = this;
        this._pouchdb = _pouchdb;
        this._allChanges$ = _allChanges$;
        this._docType = _docType;
        this._user = _user;
        this._hooks = new Hook();
        this._subs = [];
        this._docsSubject = new rxjs.BehaviorSubject([]);
        this._rxStore = new Store(this._docsSubject);
        this.docs$ = this._docsSubject.asObservable();
        this.addHook = this._hooks.addHook;
        // ------------------------------------------
        // create changes$, insert$, update$, remove$
        // ------------------------------------------
        this.changes$ = this._allChanges$.pipe(operators.filter(function (change) { return change.doc.type === _this._docType || change.id.startsWith(_this._docType); }));
        this.insert$ = this.changes$.pipe(operators.filter(function (change) { return change.op === 'INSERT'; }));
        this.update$ = this.changes$.pipe(operators.filter(function (change) { return change.op === 'UPDATE'; }));
        this.remove$ = this.changes$.pipe(operators.filter(function (change) { return change.op === 'REMOVE'; }));
        // ------------------------------------------
        // create docs$
        // ------------------------------------------
        // todo constuctor async better way?
        this.loadData().then(function (res) {
            _this._rxStore.setData(res);
        });
        this._subs.push(this.insert$.subscribe(function (next) {
            _this._rxStore.addToStore(next.doc);
        }));
        this._subs.push(this.update$.subscribe(function (next) {
            _this._rxStore.updateInStore(next.doc);
        }));
        this._subs.push(this.remove$.subscribe(function (next) {
            _this._rxStore.removeFromStore(next.doc);
        }));
    }
    // ------------------------------------------
    // methods
    // ------------------------------------------
    Collection.prototype.destroy = function () {
        this._subs.forEach(function (sub) { return sub.unsubscribe(); });
        this._rxStore = null;
    };
    Collection.prototype.loadData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var endkey, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endkey = this._docType + '-\uffff';
                        if (this._user) {
                            endkey = this._docType + '-' + this._user.code + '\uffff';
                        }
                        return [4 /*yield*/, this._pouchdb.allDocs({
                                startkey: this._docType,
                                endkey: endkey,
                                include_docs: true
                            })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.rows.map(function (row) {
                                return row.doc;
                            })];
                }
            });
        });
    };
    // ------------------------------------------
    // crud
    // ------------------------------------------
    Collection.prototype.get = function (id) {
        return this._pouchdb.get(id);
    };
    Collection.prototype.create = function (doc) {
        var _this = this;
        doc = this._hooks.runHooks(EHook.PRE_CREATE, doc);
        return this._pouchdb.create(doc).then(function () {
            _this._hooks.runHooks(EHook.POST_CREATE, doc);
        });
    };
    Collection.prototype.update = function (doc) {
        var _this = this;
        doc = this._hooks.runHooks(EHook.PRE_UPDATE, doc);
        return this._pouchdb.update(doc).then(function () {
            _this._hooks.runHooks(EHook.PRE_UPDATE, doc);
        });
    };
    Collection.prototype.save = function (doc) {
        var _this = this;
        doc = this._hooks.runHooks(EHook.PRE_SAVE, doc);
        return this._pouchdb.save(doc).then(function () {
            _this._hooks.runHooks(EHook.POST_SAVE, doc);
        });
    };
    Collection.prototype.remove = function (doc) {
        var _this = this;
        doc = this._hooks.runHooks(EHook.PRE_REMOVE, doc);
        return this._pouchdb.remove(doc).then(function () {
            _this._hooks.runHooks(EHook.POST_REMOVE, doc);
        });
    };
    Collection.prototype.removeAll = function () {
        // todo
    };
    return Collection;
}());

var Db = /** @class */ (function () {
    function Db(_name, _options) {
        var _this = this;
        this._name = _name;
        this._options = _options;
        this._hooks = new Hook();
        this.pouchdb = null;
        this.rxSync = new Sync();
        this.rxChange = new Changes();
        this.collections = {};
        // ------------------
        // methods proxy
        // ------------------
        this.info = this.pouchdb.info;
        this.compact = this.pouchdb.compact;
        this.revsDiff = this.pouchdb.revsDiff;
        this.putAttachment = this.pouchdb.putAttachment;
        this.getAttachment = this.pouchdb.getAttachment;
        this.removeAttachment = this.pouchdb.removeAttachment;
        // ------------------
        // CRUD
        // ------------------
        this.get = this.pouchdb.get;
        this.addHook = this._hooks.addHook;
        this.pouchdb = new PouchDB(_name, _options);
        this.pouchdb.create = function (doc) {
            return _this.pouchdb.put(doc).then(function (meta) {
                doc._id = meta.id;
                doc._rev = meta.rev;
                return doc;
            });
        };
        this.pouchdb.update = function (doc) {
            // TODO: fetch new rev before updating? else remove, since it's the same as create
            return _this.pouchdb.put(doc).then(function (meta) {
                doc._id = meta.id;
                doc._rev = meta.rev;
                return doc;
            });
        };
        this.pouchdb.save = function (doc) {
            return doc._rev ? _this.update(doc) : _this.create(doc);
        };
    }
    // ------------------
    // statics
    // ------------------
    Db.replicate = function (source, target, options) {
        source.replicateTo(target, options);
        return source.rxSync;
    };
    Db.sync = function (source, target, options) {
        source.sync(target, options);
        return source.rxSync;
    };
    Db.prototype.remove = function (doc) {
        var _this = this;
        doc = this._hooks.runHooks(EHook.PRE_REMOVE, doc);
        return this.pouchdb.remove(doc).then(function () {
            _this._hooks.runHooks(EHook.POST_REMOVE, doc);
        });
    };
    Db.prototype.create = function (doc) {
        var _this = this;
        doc = this._hooks.runHooks(EHook.PRE_CREATE, doc);
        return this.pouchdb.create(doc).then(function () {
            _this._hooks.runHooks(EHook.POST_CREATE, doc);
        });
    };
    Db.prototype.update = function (doc) {
        var _this = this;
        doc = this._hooks.runHooks(EHook.PRE_UPDATE, doc);
        return this.pouchdb.update(doc).then(function () {
            _this._hooks.runHooks(EHook.POST_UPDATE, doc);
        });
    };
    Db.prototype.save = function (doc) {
        var _this = this;
        doc = this._hooks.runHooks(EHook.PRE_SAVE, doc);
        return this.pouchdb.save(doc).then(function () {
            _this._hooks.runHooks(EHook.POST_SAVE, doc);
        });
    };
    Db.prototype.removeAll = function () {
        // todo
    };
    Db.prototype.bulkGet = function () {
        return this.pouchdb.bulkGet;
    };
    Db.prototype.bulkDocs = function () {
        return this.pouchdb.bulkDocs;
    };
    Db.prototype.allDocs = function () {
        return this.pouchdb.allDocs;
    };
    // ------------------
    // methods
    // ------------------
    Db.prototype.destroy = function () {
        // stop sync
        // stop changelistener
        // cleanup all collections
        // cleanup all syncs
    };
    Db.prototype.sync = function (remoteDb, options) {
        this.rxSync.setupListener(this.pouchdb.sync(remoteDb, options));
        return this.rxSync;
    };
    Db.prototype.replicateTo = function (remoteDb, options) {
        this.rxSync.setupListener(this.pouchdb.replicate(remoteDb, options));
        return this.rxSync;
    };
    Db.prototype.replicateFrom = function (remoteDb, options) {
        this.rxSync.setupListener(this.pouchdb.replicate(remoteDb, options));
        return this.rxSync;
    };
    Db.prototype.changes = function () {
        var changeOpts = {
            live: true,
            include_docs: true,
            since: 'now',
            return_docs: false
        };
        this.rxChange.setupListener(this.pouchdb.changes(changeOpts));
        return this.rxChange;
    };
    Db.prototype.collection = function (docType, user) {
        if (this.collections[docType] == docType) {
            return this.collections[docType];
        }
        var collection = new Collection(this.pouchdb, this.rxChange.change$, docType, user);
        this.collections[docType] = collection;
        return collection;
    };
    // ------------------
    // statics proxy
    // ------------------
    Db.debug = PouchDB.debug;
    Db.plugin = PouchDB.plugin;
    Db.defaults = PouchDB.defaults;
    return Db;
}());

exports.Db = Db;
