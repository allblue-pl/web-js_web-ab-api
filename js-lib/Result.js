'use strict';

import abText from "ab-text";

class Result
{

    static get ErrorResults_Other() {
        return 2;
    }

    static get ErrorResults_HttpRequestError() {
        return 3;
    }

    static get ErrorResults_HttpTimeoutError() {
        return 4;
    }

    static get ErrorResults_CannotParseJSON() {
        return 5;
    }

    static get ErrorResults_WrongResultFormat() {
        return 6;
    }
    

    static Error(request, message, errorResultId = 2) {
        var result = new Result(request);
        result.result = errorResultId;
        result.message = message;
        result.data = {};

        return result;
    }

    static Parse(request, dataString, uri, debug = false) {
        var data = null;
        try {
            data = JSON.parse(dataString);
        } catch (err) {
            // data = null;
        }

        if (data === null) {
            var result = Result.Error(request,
                    'Cannot parse json data from: ' + uri,
                    Result.ErrorResults_CannotParseJSON);
            result.data.data = dataString;

            if (debug)
                console.error(dataString);

            return result;
        }

        if (typeof data !== 'object') {
            var result = Result.Error(request,
                    'Cannot parse json data from: ' + uri,
                    Result.ErrorResults_CannotParseJSON);
            result.data.data = dataString;

            if (debug)
                console.error(dataString);

            return result;
        }

        var result = new Result(request);

        if (!('result' in data)) {
            result.result = Result.ErrorResults_WrongResultFormat;
            result.message = 'No result info in json data.';
        } else {
            result.result = data.result;
            if ('message' in data)
                result.message = data.message;
            result.data = data;
        }

        return result;
    }


    constructor(request) {
        this._request = request;
        this.result = -1;
        this.message = '';
        this.data = null;
    }

    getErrorInfo() {
        const webABApi = require('./index.js');

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
                message: this.getResponseUrl() + ' -> ' + this.data.data,
            };
        } else if (this.result === webABApi.Result.ErrorResults_WrongResultFormat) {
            return {
                title: abText.$('Sys:Errors_Response_WrongResultFormat'),
                message: this.getResponseUrl(),
            };
        }

        return null;
    }

    getResponseUrl() {
        return this._request.responseURL;
    }

    getResult() {
        return this.result;
    }

    isSuccess() {
        return this.result === 0;
    }

    isFailure() {
        return this.result === 1;
    }

    isError() {
        return this.result >= 2;
    }
    
};
module.exports = Result;