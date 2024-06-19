import connection from './connection';

export const exists = (id: string) =>
  !!connection
    .get('ignoreList')
    .find((v: string) => v === id)
    .value();

export const add = (id: string) => {
  if (exists(id)) return;

  connection.get('ignoreList').push(id).write();
};

export const remove = (id: string) => {
  connection
    .get('ignoreList')
    .remove((v: string) => v === id)
    .write();
};
