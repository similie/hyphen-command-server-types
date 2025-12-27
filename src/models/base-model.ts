import { type UUID as _UUID } from "@similie/ellipsies";
export type UUID = _UUID;
export interface BaseModel {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseUIDModel {
  uid: UUID; // TODO: needs to be UUID
  createdAt: Date;
  updatedAt: Date;
}
