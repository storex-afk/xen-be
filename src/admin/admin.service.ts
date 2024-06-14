import { Injectable } from '@nestjs/common';
import { createReadStream, unlinkSync } from 'fs';
import * as csv from 'csv-parser';
@Injectable()
export class AdminService {
  constructor() {}
  async parse(file, payload) {
    if (!file) return;
    const results = [];

    createReadStream(file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(payload);
        console.log(results);
        unlinkSync(file.path);
        return results;
      });
    return results;
  }
}
