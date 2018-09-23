import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {Store} from "./Store";
import {Filter} from "./Filter";
import {IModel} from "./interfaces/IModel";
import {filter} from "rxjs/operators";
import {EHook, Hook} from "./Hooks";

export interface ICollectionRxOptions {
  user?: Observable<string>
  filter?: Observable<any>
  filterType?: Observable<any>
  sort?: Observable<any>
}

export class Collection<T extends IModel> {

  private _hooks = new Hook();
  private _subs: Subscription[] = [];

  private _allDocsSubject: BehaviorSubject<T[]> = new BehaviorSubject([]);
  private _docsSubject: BehaviorSubject<T[]> = new BehaviorSubject([]);
  private _store: Store<T>;
  private _filter: Filter<T>;

  public changes$: Observable<any>;
  public insert$: Observable<any>;
  public update$: Observable<any>;
  public remove$: Observable<any>;
  public docs$: Observable<T[]> = this._docsSubject.asObservable();
  public allDocs$: Observable<T[]> = this._allDocsSubject.asObservable();


  // todo change user to observable
  constructor(private _pouchdb, private _allChanges$, private _docType: string, private _observableOptions: ICollectionRxOptions = {}) {

    // todo observable filters

    if (this._observableOptions.user) {
      this._observableOptions.user.subscribe(next => {
        this.loadDocs();
      });
    }

    // ------------------------------------------
    // create changes$, insert$, update$, remove$
    // ------------------------------------------
    this.changes$ = this._allChanges$.pipe(
      filter((change: any) => change.doc.type === this._docType || change.id.startsWith(this._docType))
    );

    this.insert$ = this.changes$.pipe(
      filter((change: any) => change.op === 'INSERT')
    );

    this.update$ = this.changes$.pipe(
      filter((change: any) => change.op === 'UPDATE')
    );

    this.remove$ = this.changes$.pipe(
      filter((change: any) => change.op === 'REMOVE')
    );
  }

  // ------------------------------------------
  // live docs$
  // ------------------------------------------
  public enableLiveDocs() {
    if (this._store) return;

    this._store = new Store(this._allDocsSubject);
    this._filter = new Filter(this._docsSubject, this._store.getDocs,
      this._observableOptions.filter, this._observableOptions.filterType, this._observableOptions.sort);

    this.all().then(res => {
      this._store.setDocs(res);
    });

    this._subs.push(
      this.insert$.subscribe(next => {
        this._store.addToStore(next.doc);
        this._filter.addToStore(next.doc);
      })
    );

    this._subs.push(
      this.update$.subscribe(next => {
        this._store.updateInStore(next.doc);
        this._filter.updateInStore(next.doc);
      })
    );

    this._subs.push(
      this.remove$.subscribe(next => {
        this._store.removeFromStore(next.doc);
        this._filter.removeFromStore(next.doc);
      })
    );
  }

  public disableLiveDocs() {
    if (!this._store) return;
    this._subs.forEach(sub => sub.unsubscribe());
    this._filter = null;
    this._store = null;
  }

  // ------------------------------------------
  // methods
  // ------------------------------------------
  public loadDocs() {
    this.all().then(res => {
      this._store.setDocs(res);
      this._filter._init();
    });
  }

  public destroy() {
    this.disableLiveDocs();
  }

  public addHook = this._hooks.addHook;
  public setFilter = this._filter.setFilter;
  public setSort = this._filter.setSort;
  public extendComparator = this._filter.extendComparator;

  // ------------------------------------------
  // crud
  // ------------------------------------------
  public get(id: string) {
    return this._pouchdb.get(id);
  }

  public async create(doc) {
    doc.type = this._docType;
    doc._id = this._docType + '-' + doc._id;
    doc = await this._hooks.runHooks(EHook.PRE_CREATE, doc);
    return this._pouchdb.create(doc).then(() => {
      this._hooks.runHooks(EHook.POST_CREATE, doc);
    });
  }

  public async update(doc) {
    doc = await this._hooks.runHooks(EHook.PRE_UPDATE, doc);
    return this._pouchdb.update(doc).then(() => {
      this._hooks.runHooks(EHook.PRE_UPDATE, doc);
    });
  }

  public async save(doc) {
    doc = await this._hooks.runHooks(EHook.PRE_SAVE, doc);
    let promise = doc._rev ? this.update(doc): this.create(doc);
    return promise.then(() => {
      this._hooks.runHooks(EHook.POST_SAVE, doc);
    });
  }

  public async remove(doc) {
    doc = await this._hooks.runHooks(EHook.PRE_REMOVE, doc);
    return this._pouchdb.remove(doc).then(() => {
      this._hooks.runHooks(EHook.POST_REMOVE, doc);
    });
  }

  public async removeAll() {
    return this.all().then(docs => {
      return Promise.all(docs.map((doc) => {
        return this._pouchdb.remove(doc)
      }))
    })
  }

  public async all() {
    let endkey = this._docType + '-\uffff';
    if (this._observableOptions.user) {
      endkey = this._docType + '-' + this._observableOptions.user + '\uffff'
    }

    let res = await this._pouchdb.allDocs({
      startkey: this._docType,
      endkey: endkey,
      include_docs: true
    });

    return res.rows.map(row => {
      return row.doc;
    });
  }


}