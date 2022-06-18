/// <reference types="node" />
import * as fs from 'fs';
interface FileReadOptions {
    basePath?: string;
    recursive?: boolean;
    excludeHidden?: boolean;
    sync?: boolean;
    ignoreType?: string;
    valuetizer?: (stat: any, shortName: string, longPath: string, isDir?: boolean) => any;
}
export declare function promiseFiles(dir: any, type: any, options?: FileReadOptions, statOptions?: fs.StatSyncOptions): Promise<unknown>;
export declare function files(dir: any, type: any, callback: any, options?: FileReadOptions, statOptions?: fs.StatSyncOptions): any;
export {};
