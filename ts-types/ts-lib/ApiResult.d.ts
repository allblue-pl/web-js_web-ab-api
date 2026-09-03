import type { ErrorInfo, ResultData } from "./ts-types.ts";
export default class ApiResult {
    #private;
    static get UnknownResult(): -1;
    static get SuccessResult(): 0;
    static get FailureResult(): 1;
    static get ErrorResults_Other(): 2;
    static get ErrorResults_HttpRequestError(): 3;
    static get ErrorResults_HttpTimeoutError(): 4;
    static get ErrorResults_CannotParseJSON(): 5;
    static get ErrorResults_WrongResultFormat(): 6;
    static Error(request: XMLHttpRequest, message: string, errorResultId?: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6): ApiResult;
    static Parse(request: XMLHttpRequest, dataString: string, uri: string, debug?: boolean): ApiResult;
    result: number;
    message: string;
    data: ResultData;
    constructor(request: XMLHttpRequest, result: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6, message: string, data: ResultData);
    getErrorInfo(): ErrorInfo | null;
    getResponseUrl(): string;
    getResult(): number;
    isSuccess(): boolean;
    isFailure(): boolean;
    isError(): boolean;
}
