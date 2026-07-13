import type { TS0RawObject } from "@allblue/ts0";
import webABApi from "./index.js";
import abText from "ab-text";
import type { ErrorInfo, ResultData } from "./ts-types.ts";

export default class Result {
    static get ErrorResults_Other(): number {
        return 2;
    }

    static get ErrorResults_HttpRequestError(): number {
        return 3;
    }

    static get ErrorResults_HttpTimeoutError(): number {
        return 4;
    }

    static get ErrorResults_CannotParseJSON(): number {
        return 5;
    }

    static get ErrorResults_WrongResultFormat(): number {
        return 6;
    }


    static Error(request: XMLHttpRequest, message: string, errorResultId: number = 2): Result {
        return new Result(request, errorResultId, message, {
            result: -1,
            message: "",
            data: {},
        });
    }

    static Parse(request: XMLHttpRequest, dataString: string, uri: string, 
            debug: boolean = false): Result {
        let data = null;
        try {
            data = JSON.parse(dataString);
        } catch (err) {
            // data = null;
        }

        if (data === null) {
            let result = Result.Error(request,
                    'Cannot parse json data from: ' + uri,
                    Result.ErrorResults_CannotParseJSON);
            result.data.data = dataString;

            if (debug)
                console.error(dataString);

            return result;
        }

        if (typeof data !== 'object') {
            let result = Result.Error(request,
                    'Cannot parse json data from: ' + uri,
                    Result.ErrorResults_CannotParseJSON);
            result.data.data = dataString;

            if (debug)
                console.error(dataString);

            return result;
        }

        if (!('result' in data)) {
            return new Result(request, Result.ErrorResults_WrongResultFormat,
                    'No result info in json data.', {
                result: -1,
                message: "",
                data: {},
            });
        } else {
            return new Result(request, data.result, data.message, data);
        }
    }


    #request: XMLHttpRequest;
    result: number;
    message: string;
    data: ResultData;


    constructor(request: XMLHttpRequest, result: number, message: string, 
            data: ResultData) {
        this.#request = request;
        this.result = result;
        this.message = message;
        this.data = data;
    }

    getErrorInfo(): ErrorInfo|null {
        if (this.result === webABApi.Result.ErrorResults_Other) {
            return {
                title: abText.$('Sys:Errors_Response_Other'),
                message: this.getResponseUrl() + ' -> ' + this.message,
            }
        } else if (this.result === webABApi.Result.ErrorResults_HttpRequestError) {
            return {
                title: abText.$('Sys:Errors_Response_HttpRequestError'),
                message: this.getResponseUrl() + ' -> ' + this.message,
            };
        } else if (this.result === webABApi.Result.ErrorResults_HttpTimeoutError) {
            return {
                title: abText.$('Sys:Errors_Response_HttpTimeoutError'),
                message: '',
            };
        } else if (this.result === webABApi.Result.ErrorResults_CannotParseJSON) {
            return {
                title: abText.$('Sys:Errors_Response_CannotParseJSON'),
                message: this.getResponseUrl() + ' -> ' + 
                        (this.data  === null ? "null" : this.data.data),
            };
        } else if (this.result === webABApi.Result.ErrorResults_WrongResultFormat) {
            return {
                title: abText.$('Sys:Errors_Response_WrongResultFormat'),
                message: this.getResponseUrl(),
            };
        }

        return null;
    }

    getResponseUrl(): string {
        return this.#request.responseURL;
    }

    getResult(): number {
        return this.result;
    }

    isSuccess(): boolean {
        return this.result === 0;
    }

    isFailure(): boolean {
        return this.result === 1;
    }

    isError(): boolean {
        return this.result >= 2;
    }
    
};