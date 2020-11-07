import { Client } from 'pg';
import { dbOptions } from '../config/dbOptions'

export abstract class DataBaseService {
    protected client: Client;

    constructor() {
        this.client = new Client(dbOptions);
    }

    protected async query(queryText: string, parameters?: any[], connect = true): Promise<any[]> {
        try {
            if (connect) {
                await this.client.connect();
            }

            const { rows: results } = await this.client.query(queryText, parameters);

            return results

        } catch(error) {
            console.error('Error database: ', error.stack);

            throw error;
        } finally {
            if (connect) {
                await this.client.end();
            }
        }
    }

    protected async connect() {
        await this.client.connect();
    }

    protected async disconnect() {
        await this.client.end();
    }
    
    protected async beginTransaction() {       
        try {

            await this.query('BEGIN', null, false);

        } catch(error) {
            console.error('Error beginning transaction: ', error.stack);
            throw error;
        }          
    }

    protected async commitTransaction() {       
        try {

            await this.query('COMMIT', null, false);

        } catch(error) {
            console.error('Error committing transaction: ', error.stack);
            throw error;
        }          
    }

    protected async rollbackTransaction(err: any) {
        if (err) {
            console.error('Error in transaction: ', err.stack)
            
            try {

                await this.query('ROLLBACK', null, false);

            } catch(error) {
                console.error('Error rolling back client', error.stack);
                throw error;
            }
            
          }

          return !!err
    }
}