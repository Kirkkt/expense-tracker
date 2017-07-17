import Database from './Database';

Database.resetCollectionPromise('users')
  .then(() => Database.resetCollectionPromise('records'))
  .then(() => Database.resetCollectionPromise('sessions'))
  .then(() => Database.initialize());
