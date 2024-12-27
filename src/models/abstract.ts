import {FirebaseAdminService} from "../services/firebase/firebase_admin/firebase_admin.service";

interface HashedEntity {
    hashed_id: string;
}

export interface IScholarship extends HashedEntity {
    name: string;
    date_of_creation: string;
    file: string;
}

export abstract class ScholarshipService<T extends HashedEntity> {
    public abstract get_name(): string;

    public abstract get_url(): string ;

    protected storage: T[] = [];
    private hashedIdSet: Set<string> = new Set();

    protected firebase_service: FirebaseAdminService;

    protected constructor(_firebase_service: FirebaseAdminService) {
        this.firebase_service = _firebase_service;
        this.firebase_service.get_all_doc(this).then((data) => {
            this.storage = data;

            this.hashedIdSet = new Set(this.storage.map((_data) => _data.hashed_id));
        })
    }


    public isNewData(newData: T): boolean {
        return !this.hashedIdSet.has(newData.hashed_id);
        // return !this.storage.some((data) => {
        //     return data.hashed_id === newData.hashed_id
        // });
    }

    public async updateLatestData(newData: T[]): Promise<T[]> {
        let new_data: T[] = [];
        // console.log("set",this.hashedIdSet,newData)
        for (const data of newData) {
            if (this.isNewData(data)) {
                // if(await this.firebase_service.is_doc_exist(this,data)){
                //     continue
                // }
                await this.firebase_service.write_doc(this, data);
                this.storage.push(data);
                this.hashedIdSet.add(data.hashed_id);
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

