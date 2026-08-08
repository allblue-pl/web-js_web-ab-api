import ApiResult from "./ApiResult.ts";
import ts0, { type TS0NotSet, type TS0RawObject } from "@allblue/ts0";
declare class webABApi_Class {
    #private;
    get Result(): typeof ApiResult;
    get debug(): boolean;
    get requestTimeout(): number;
    constructor();
    json(uri: string, json: TS0RawObject, fn: ResultFn, timeout?: number | TS0NotSet): void;
    json_Async(uri: string, json: TS0RawObject, timeout?: number | TS0NotSet): Promise<ApiResult>;
    post(uri: string, fields: Fields, fn: ResultFn, timeout?: number | TS0NotSet): void;
    setDebug(debug: boolean): void;
    setOnErrorListener(onError: ((err: Error) => void) | null): void;
    setRequestTimeout(timeout: number): void;
    upload(uri: string, json: TS0RawObject, files: {
        [fileName: string]: string;
    }, fn: ResultFn, timeout?: number | typeof ts0.notSet): void;
    upload_Async(uri: string, json: TS0RawObject, files: {
        [fileName: string]: string;
    }, timeout?: number | typeof ts0.notSet): Promise<ApiResult>;
}
declare const webABApi: webABApi_Class;
export default webABApi;
type Fields = {
    [fieldName: string]: string;
};
type ResultFn = (result: ApiResult) => void;
