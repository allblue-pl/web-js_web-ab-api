import type { TS0RawObject } from "@allblue/ts0";
import webABApi from "./index.ts";
import abText from "ab-text";
import type { ErrorInfo, ResultData } from "./ts-types.ts";

export default class ApiResult {
    static get UnknownResult(): -1 {
        return -1;
    }

    static get SuccessResult(): 0 {
        return 0;
    }

    static get FailureResult(): 1 {
        return 1;
    }

    static get ErrorResults_Other(): 2 {
        return 2;
    }

    static get ErrorResults_HttpRequestError(): 3 {
        return 3;
    }

    static get ErrorResults_HttpTimeoutError(): 4 {
        return 4;
    }

    static get ErrorResults_CannotParseJSON(): 5 {
        return 5;
    }

    static get ErrorResults_WrongResultFormat(): 6 {
        return 6;
    }


    static Error(request: XMLHttpRequest, message: string, errorResultId: -1|0|1|2|3|4|5|6 = 2): 
            ApiResult {
        return new ApiResult(request, errorResultId, message, {
            result: -1,
            message: "",
            data: {},
        });
    }

    static Parse(request: XMLHttpRequest, dataString: string, uri: string, 
            debug: boolean = false): ApiResult {
        let data = null;
        try {
            data = JSON.parse(dataString);
        } catch (err) {
            // data = null;
        }

        if (data === null) {
            let result = ApiResult.Error(request,
                    'Cannot parse json data from: ' + uri,
                    ApiResult.ErrorResults_CannotParseJSON);
            result.data.data = { dataString: dataString };

            if (debug)
                console.error(dataString);

            return result;
        }

        if (typeof data !== 'object') {
            let result = ApiResult.Error(request,
                    'Cannot parse json data from: ' + uri,
                    ApiResult.ErrorResults_CannotParseJSON);
            result.data.data = { dataString: dataString };
            if (debug)
                console.error(dataString);

            return result;
        }

        if (!('result' in data)) {
            return new ApiResult(request, ApiResult.ErrorResults_WrongResultFormat,
                    'No result info in json data.', {
                result: 2,
                message: "",
                data: {},
            });
        } else {
            return new ApiResult(request, data.result, data.message, data);
        }
    }


    #request: XMLHttpRequest;
    result: number;
    message: string;
    data: ResultData;


    constructor(request: XMLHttpRequest, result: -1|0|1|2|3|4|5|6, message: string, 
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