export type UUID = `${string}-${string}-${string}-${string}-${string}`;
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