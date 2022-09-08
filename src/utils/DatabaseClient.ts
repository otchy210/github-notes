import { Collection } from '@otchy/sim-doc-db';
import { Document, Field, Json } from '@otchy/sim-doc-db/dist/types';
import { Note } from '../types';

const SCHEMA: Field[] = [
  {
    name: 'key',
    type: 'tag',
    indexed: true,
  },
  {
    name: 'content',
    type: 'string',
    indexed: true,
  },
  {
    name: 'updatedAt',
    type: 'number',
    indexed: false,
  },
];

export class DatabaseClient {
  collection: Collection;
  constructor() {
    this.collection = new Collection(SCHEMA);
  }
  add(note: Note): Document {
    return this.collection.add({ values: note });
  }
  /**
   * Update if note.key exsits in DB otherwise add
   */
  addOrUpdate(note: Note): Document {
    const { key } = note;
    const docs = this.collection.find({ key });
    if (docs.size === 0) {
      return this.add(note);
    } else {
      const { id } = Array.from(docs)[0];
      return this.collection.update({
        id,
        values: note,
      });
    }
  }
  remove(key: string): Document | undefined {
    const docs = this.collection.find({ key });
    if (docs.size === 0) {
      return undefined;
    }
    this.collection.removeMatched({ key });
    return Array.from(docs)[0];
  }
  getAll(): Note[] {
    return Array.from(this.collection.getAll()).map((doc) => doc.values) as Note[];
  }
  find(key: string): Note | undefined {
    const docs = this.collection.find({ key });
    if (docs.size === 0) {
      return undefined;
    }
    const doc = Array.from(docs)[0];
    return doc.values as Note;
  }
  refresh(notes: Note[]) {
    this.collection.clear();
    notes.forEach((note) => this.add(note));
  }
  import(json: Json) {
    this.collection.import(json);
  }
  export(): Json {
    return this.collection.export();
  }
}
