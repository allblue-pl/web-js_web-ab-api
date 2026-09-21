import ApiResult from "./ApiResult.ts";
import ts0, { type TS0NotSet, type TS0RawObject } from "@allblue/ts0";

class webABApi_Class {
    #debug: boolean;
    #listeners_OnError: ((err: Error) => void)|null;
    #requestTimeout: number;


    get Result(): typeof ApiResult {
        return ApiResult;
    }

    get debug(): boolean {
        return this.#debug;
    }

    get requestTimeout(): number {
        return this.#requestTimeout;
    }

    constructor() {
        this.#debug = false;
        this.#listeners_OnError = null;
        this.#requestTimeout = 0;
    }

    json(uri: string, json: TS0RawObject, fn: ResultFn, timeout: number|TS0NotSet = ts0.notSet):
            void {
        var jsonString = JSON.stringify(json);
        if (jsonString === null)
            throw new Error('Cannot parse json.');

        this.post(uri, { json: jsonString }, fn, timeout);
    }

    async json_Async(uri: string, json: TS0RawObject, timeout: number|TS0NotSet = ts0.notSet):
            Promise<ApiResult> {
        return new Promise((resolve, reject) => {
            this.json(uri, json, (result) => {
                resolve(result);
            }, timeout);
        });
    }

    post(uri: string, fields: Fields, fn: ResultFn, timeout: number|TS0NotSet = ts0.notSet): 
            void {
        timeout = timeout === ts0.notSet ? this.requestTimeout : timeout;

        var formData = new FormData();
        for (var fieldName in fields)
            formData.append(fieldName, fields[fieldName]);

        var request = new XMLHttpRequest();
        request.open('POST', uri, true);
        request.timeout = timeout;
        request.onerror = (evt) => {
            let result = ApiResult.Error(request, 
                    `Http request error.`, 
                    ApiResult.ErrorResults_Other);

            this.#callResultFn(fn, result);
        };
        request.ontimeout = () => {
            let result = ApiResult.Error(request, 
                   `Http request error: connection timeout`, 
                    ApiResult.ErrorResults_HttpTimeoutError);

            this.#callResultFn(fn, result);
        };
        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                var result = ApiResult.Parse(request, request.responseText, uri, 
                        this.debug);

                if (this.debug)
                    console.log('webABApi', uri, fields, result);

                this.#callResultFn(fn, result);
            } else {
                let result = ApiResult.Error(request,
                        `Http request error: ${request.status} -> ` +
                        request.responseText, 
                        ApiResult.ErrorResults_HttpRequestError);

                this.#callResultFn(fn, result);
            }
        };
        request.send(formData);
    }

    setDebug(debug: boolean): void {
        this.#debug = debug;
    }

    setOnErrorListener(onError: ((err: Error) => void)|null): void {
        this.#listeners_OnError = onError;
    }

    setRequestTimeout(timeout: number): void {
        this.#requestTimeout = timeout;
    }

    upload(uri: string, json: TS0RawObject, files: {[fileName: string]: File}, 
            fn: ResultFn, timeout: number|typeof ts0.notSet = ts0.notSet): void {
        var fields: Fields = {};
        for (var fileName in files) {
            if (files[fileName] === null)
                json[fileName] = null;
            else
                fields[fileName] = files[fileName];
        }

        var jsonStr = JSON.stringify(json);
        if (jsonStr === null)
            throw new Error('Cannot parse json.');
        fields.json = jsonStr;

        this.post(uri, fields, fn, timeout);
    }

    async upload_Async(uri: string, json: TS0RawObject, files: {[fileName: string]: File}, 
            timeout: number|typeof ts0.notSet = ts0.notSet): Promise<ApiResult> {
        return new Promise((resolve, reject) => {
            this.upload(uri, json, files, (result) => {
                resolve(result);
            }, timeout);
        });
    }


    #callResultFn(fn: ResultFn, result: ApiResult): void {
        try {
            fn(result);
        } catch (err: any) {
            if (this.#listeners_OnError === null)
                throw err;

            this.#listeners_OnError(err as Error);
        }
    }
}
const webABApi = new webABApi_Class();
export default webABApi;

type Fields = {[fieldName: string]: string|File};
type ResultFn = (result: ApiResult) => void;