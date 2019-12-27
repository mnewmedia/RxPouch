import { Sync } from "./Sync";
import { Changes } from "./Changes";
import { Collection, ICollectionRxOptions } from "./Collection";
export default class Db {
    private _name;
    private _options?;
    private _hooks;
    pouchdb: any;
    rxSync: Sync;
    rxChange: Changes;
    collections: {};
    constructor(_name: string, _options?: any);
    static replicate(source: Db, target: Db, options: any): Sync;
    static sync(source: Db, target: Db, options: any): Sync;
    static debug: any;
    static plugin: any;
    static defaults: any;
    info: any;
    compact: any;
    revsDiff: any;
    putAttachment: any;
    getAttachment: any;
    removeAttachment: any;
    get: any;
    remove(doc: any): Promise<any>;
    create(doc: any): Promise<any>;
    update(doc: any): Promise<any>;
    save(doc: any): Promise<any>;
    removeAll(): Promise<[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]>;
    bulkGet: any;
    bulkDocs: any;
    allDocs: any;
    all(): Promise<any>;
    destroy(): void;
    addHook: (hookName: string, fn: (doc: any) => any) => void;
    sync(remoteDb: Db, options?: any): Sync;
    replicateTo(remoteDb: any, options?: any): Sync;
    replicateFrom(remoteDb: any, options?: any): Sync;
    changes(): Changes;
    collection(docType: string, observableOptions?: ICollectionRxOptions): Collection<any>;
}