import { type UUID as _UUID } from "@similie/ellipsies";
export type UUID = _UUID;
export interface BaseModel {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface BaseUIDModel {
    uid: UUID;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=base-model.d.ts.map