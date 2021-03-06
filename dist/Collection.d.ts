import { Observable } from "rxjs";
import { IModel } from "./interfaces/IModel";
import { ISort } from "./interfaces/ISort";
export interface ICollectionRxOptions {
    user?: Observable<string>;
    filter?: Observable<any>;
    filterType?: Observable<any>;
    sort?: Observable<any>;
}
export declare class Collection<T extends IModel> {
    private _pouchdb;
    private _allChanges$;
    private _docType;
    private _observableOptions;
    private _hooks;
    private _subs;
    private _subsOpts;
    private _allDocsSubject;
    private _docsSubject;
    private _store;
    private _filter;
    changes$: Observable<any>;
    insert$: Observable<any>;
    update$: Observable<any>;
    remove$: Observable<any>;
    docs$: Observable<T[]>;
    allDocs$: Observable<T[]>;
    private isLiveDocsEnabled;
    constructor(_pouchdb: any, _allChanges$: any, _docType: string, _observableOptions?: ICollectionRxOptions);
    enableLiveDocs(): Promise<void>;
    disableLiveDocs(): void;
    private loadDocs;
    destroy(): void;
    addHook: (hookName: string, fn: (doc: any) => any) => void;
    setFilter: (filter: any, filterType: any) => void;
    setSort: (sortFields: ISort) => void;
    extendComparator: (comparator: any) => void;
    get(id: string): any;
    create(doc: any): Promise<any>;
    update(doc: any): Promise<any>;
    save(doc: any): Promise<void>;
    remove(doc: any): Promise<any>;
    removeAll(): Promise<[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]>;
    all(): Promise<any>;
}
