- minify build
- too many module types? maybe just go for some newer, since everybody will anyway have a bundler? need help
- pouchify steal ideas
- check docs again
- update readme
- codeing

  /**
   * usage:
   *
   * document.original // private backup
   * doucment.doc // private doc, all props are proxied here, before proxying setter makes a original backup
   * document.restore()
   * document.save()
   * document.remove()
   * document.$.subscribe
   * document.$.update.subscribe
   * document.$.remove.subscribe
   *
   * db.order.$.subscribe
   * db.order.insert$.subscribe
   * db.order.update$.subscribe
   * db.order.remove$.subscribe
   * db.order.filtered$.subscribe
   * db.order.filterDirty$.subscribe
   * db.order.setFilter(filter)
   * db.order.resetFilter()
   * db.order.setSort(sort)
   * db.order.resetSort()
   * db.order.dump()
   * db.order.importDump()
   *
   * db.uploads$
   * db.downloads$
   * db.completedPull$
   * db.completedPush$
   * db.completed$
   * db.live$
   * db.lastSync$
   * db.status$
   * db.writePermission$
   * db.user???
   * db.isTest
   *
   * db.insert(doc)
   * db.remove(id|doc)
   * db.dump()
   * db.importDump()
   * db.destroy // free up memory
   * db.sync // returns RXSyncer
   *
   * db.login()
   * db.logout() // Destory
   *
   * syncer.change$.subscribe
   * syncer.docs$.subscibe
   * syncer.active$.subscribe
   * syncer.complete$.subscribe
   * syncer.error$.subscribe
   * syncer.cancel()
   *
   */