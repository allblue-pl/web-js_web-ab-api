'use strict';


class Result
{

    static get ErrorResults_Other() {
        return 2;
    }

    static get ErrorResults_HttpRequestError() {
        return 3;
    }

    static get ErrorResults_CannotParseJSON() {
        return 4;
    }

    static get ErrorResults_WrongResultFormat() {
        return 5;
    }


    static Error(message, errorResultId = 2)
    {
        var result = new Result();
        result.result = errorResultId;
        result.message = message;
        result.data = {};

        return result;
    }

    static Parse(dataString, uri, debug = false)
    {
        var data = null;
        try {
            data = JSON.parse(dataString);
        } catch (err) {
            // data = null;
        }

        if (data === null) {
            var result = Result.Error(
                    'Cannot parse json data from: ' + uri,
                    Result.ErrorResults_CannotParseJSON);
            result.data.data = dataString;

            if (debug)
                console.error(dataString);

            return result;
        }

        if (typeof data !== 'object') {
            var result = Result.Error(
                    'Cannot parse json data from: ' + uri,
                    Result.ErrorResults_CannotParseJSON);
            result.data.data = dataString;

            if (debug)
                console.error(dataString);

            return result;
        }

        var result = new Result();

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


    constructor()
    {
        this.result = -1;
        this.message = '';
        this.data = null;
    }

    getResult()
    {
        return this.result;
    }

    isSuccess()
    {
        return this.result === 0;
    }

    isFailure()
    {
        return this.result === 1;
    }

    isError()
    {
        return this.result >= 2;
    }
    
};
module.exports = Result;