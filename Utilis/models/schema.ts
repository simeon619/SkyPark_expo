
import { appSchema, tableSchema , } from '@nozbe/watermelondb'

export const schema = appSchema({
  version: 1,
  tables: [
    // We'll add tableSchemas here later
  ]
})



// import Realm, { BSON } from 'realm';

// class UrlData extends Realm.Object<UrlData> {
//   url!: string;
//   size!: number;
//   extension!: string;
//   _id!: BSON.ObjectId;
//   static schema = {
//     name: 'UrlData',
//     properties: {
//       url: 'string',
//       size: 'int',
//       extension: 'string',
//       _id: 'objectId',
//     },
//   };
// }

// class MessageDiscussion extends Realm.Object<MessageDiscussion> {
//   _id!: BSON.ObjectId;
//   text?: string;
//   files?: Realm.List<UrlData>;
//   targets?: Realm.List<string>;
//   status?: {
//     send?: number;
//     received?: number;
//     seen?: number;
//   };
//   __createdAt: number = Math.round(new Date().getTime() / 1000);
//   __updatedAt: number = Math.round(new Date().getTime() / 1000);
//   __parentList?: {
//     modelPath: string;
//     id: string;
//   }[];
//   static schema = {
//     name: 'MessageDiscussion',
//     properties: {
//       _id: 'objectId',
//       text: 'string?',
//       files: 'UrlData[]',
//       targets: 'string[]',
//       status: {
//         type: 'object',
//         properties: {
//           send: 'int?',
//           received: 'int?',
//           seen: 'int?',
//         },
//       },
//       __createdAt: 'int',
//       __updatedAt: 'int',
//       __parentList: 'UsersDiscussion[]',
//     },
//   };
// }

// class UsersDiscussion extends Realm.Object {
//   _id!: BSON.ObjectId;
//   messages!: Realm.List<MessageDiscussion>;
//   static schema = {
//     name: 'UsersDiscussion',
//     properties: {
//       _id: 'objectId',
//       messages: 'MessageDiscussion[]',
//     },
//   };
// }


// export const schemas = [UsersDiscussion];

