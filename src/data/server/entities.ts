import type { EntityName, EntityRecord } from "../entities";
import {
  documentFromRow,
  documentToRow,
  filingFromRow,
  filingToRow,
  periodFromRow,
  periodToRow,
  settingsFromRow,
  settingsToRow,
  transactionFromRow,
  transactionToRow,
} from "../remote/mappers";
import { TABLES, upsertRow } from "./tables";

type ServerEntity<Record> = {
  table: string;
  save: (record: Record) => Promise<Record>;
};

function serverEntity<Record, Row>(
  table: string,
  toRow: (record: Record) => object,
  fromRow: (row: Row) => Record,
): ServerEntity<Record> {
  return {
    table,
    save: async (record) => fromRow(await upsertRow<Row>(table, toRow(record))),
  };
}

export const SERVER_ENTITIES: { [Name in EntityName]: ServerEntity<EntityRecord[Name]> } = {
  transaction: serverEntity(TABLES.transactions, transactionToRow, transactionFromRow),
  filing: serverEntity(TABLES.filings, filingToRow, filingFromRow),
  period: serverEntity(TABLES.periods, periodToRow, periodFromRow),
  document: serverEntity(TABLES.documents, documentToRow, documentFromRow),
  settings: serverEntity(TABLES.settings, settingsToRow, settingsFromRow),
};

export function saveEntity<Name extends EntityName>(entity: Name, record: EntityRecord[Name]) {
  return SERVER_ENTITIES[entity].save(record);
}
