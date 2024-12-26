interface HashedEntity {
    hashed_id: string;
}

export abstract class ScholarshipService<T extends HashedEntity> {
    public abstract name: string;
    public abstract url: string;
    protected storage: T[] = [];

    public isNewData(newData: T): boolean {
        return !this.storage.some((data) => data.hashed_id === newData.hashed_id);
    }

    public updateLatestData(newData: T[]): T[] {
        let new_data: T[] = [];
        for (const data of newData) {
            if (this.isNewData(data)) {
                this.storage.push(data);
                new_data.push(data);
            }
        }
        return new_data;
    }

    public getStorage(): T[] {
        return this.storage;
    }

    public abstract requestNewData(): Promise<T[]>;
    protected abstract _request_new_data(): Promise<T[]>; // This is the actual implementation of the requestNewData method
    protected abstract parse_html(data: string): T[]; // This is the actual implementation of the parse_html method

}

