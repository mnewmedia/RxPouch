export declare class Sync {
    private pouchSync;
    private _subs;
    private _subjects;
    _isListening: boolean;
    change$: import("rxjs/internal/Observable").Observable<{}>;
    docs$: import("rxjs/internal/Observable").Observable<{}>;
    active$: import("rxjs/internal/Observable").Observable<boolean>;
    complete$: import("rxjs/internal/Observable").Observable<boolean>;
    error$: import("rxjs/internal/Observable").Observable<{}>;
    localLastSeq$: import("rxjs/internal/Observable").Observable<{}>;
    remoteLastSeq$: import("rxjs/internal/Observable").Observable<{}>;
    remotePending$: import("rxjs/internal/Observable").Observable<{}>;
    constructor();
    setupListener(pouchSync: any): void;
    cancel(): void;
}
