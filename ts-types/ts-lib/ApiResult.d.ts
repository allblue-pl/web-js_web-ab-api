import type { ErrorInfo, ResultData } from "./ts-types.ts";
export default class ApiResult {
    #private;
    static get ErrorResults_Other(): number;
    static get ErrorResults_HttpRequestError(): number;
    static get ErrorResults_HttpTimeoutError(): number;
    static get ErrorResults_CannotParseJSON(): number;
    static get ErrorResults_WrongResultFormat(): number;
    static Error(request: XMLHttpRequest, message: string, errorResultId?: number): ApiResult;
    static Parse(request: XMLHttpRequest, dataString: string, uri: string, debug?: boolean): ApiResult;
    result: number;
    message: string;
    data: ResultData;
    constructor(request: XMLHttpRequest, result: number, message: string, data: ResultData);
    getErrorInfo(): ErrorInfo | null;
    getResponseUrl(): string;
    getResult(): number;
    isSuccess(): boolean;
    isFailure(): boolean;
    isError(): boolean;
}
