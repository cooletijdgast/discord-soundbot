import Sound from "./models/Sound";
import connection from "./connection";

interface SoundRepositoryActions{
  findByName(sound: string): Promise<Sound>,
  addSingleTag(sound: string, tag: string): Promise<void>,
  exists(name: string): Promise<boolean>,
  add(sound: string): Promise<void>,
  rename(oldName: string, newName: string): Promise<void>,
  remove(name: string): Promise<void>,
  incrementCount(sound: string): Promise<void>;
  withTag(tag: string): Promise<Sound>;
  addTags(sound: string, tags: string[]): Promise<void>;
  listTags(sound: string): Promise<Sound>;
  clearTags(sound: string): Promise<void>;
  mostPlayed(): Promise<Sound[]>;
}

export class SoundRepository implements SoundRepositoryActions{
    findByName(sound: string): Promise<Sound> {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM sounds WHERE name= ?;`, [sound], (err, res) => {
                if(err){
                    reject(err);
                }else {
                    resolve(res)
                }
            })
        })
    }
    addSingleTag(sound: string, tag: string): Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM sounds WHERE name= ?;`, [sound], (err, res) => {
                if(err){
                    reject(err);
                }else {
                    resolve(res)
                }
            })
        })
    }
}