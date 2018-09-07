# Hooks

RxPouch provides following hooks either per database and per collection.

- PRE_CREATE
- POST_CREATE
- PRE_UPDATE
- POST_UPDATE
- PRE_SAVE
- POST_SAVE
- PRE_REMOVE
- POST_REMOVE

```js
// save all docs, with a timestamp property.
db.addHook(EHook.PRE_SAVE,(doc) => {
    doc.modified = new Date().getTime();
    return doc;
})
```

```js
// if user get's deleted, also remove he's other data.
UserCollection.addHook(EHook.POST_REMOVE,(doc) => {
    db.remove(doc.userSettingsId);
})
```