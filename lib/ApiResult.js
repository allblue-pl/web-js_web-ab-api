                                                 
import webABApi from "./index.js";
import abText from "ab-text";
                                                           

export default class ApiResult {
    static get UnknownResult()     {
        return -1;
    }

    static get SuccessResult()    {
        return 0;
    }

    static get FailureResult()    {
        return 1;
    }

    static get ErrorResults_Other()    {
        return 2;
    }

    static get ErrorResults_HttpRequestError()    {
        return 3;
    }

    static get ErrorResults_HttpTimeoutError()    {
        return 4;
    }

    static get ErrorResults_CannotParseJSON()    {
        return 5;
    }

    static get ErrorResults_WrongResultFormat()    {
        return 6;
    }


    static Error(request                , message        , errorResultId                   = 2)  
                      {
        return new ApiResult(request, errorResultId, message, {
            result: -1,
            message: "",
            data: {},
        });
    }

    static Parse(request                , dataString        , uri        , 
            debug          = false)            {
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


    #request                ;
    result        ;
    message        ;
    data            ;


    constructor(request                , result                  , message        , 
            data            ) {
        this.#request = request;
        this.result = result;
        this.message = message;
        this.data = data;
    }

    getErrorInfo()                 {
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

    getResponseUrl()         {
        return this.#request.responseURL;
    }

    getResult()         {
        return this.result;
    }

    isSuccess()          {
        return this.result === 0;
    }

    isFailure()          {
        return this.result === 1;
    }

    isError()          {
        return this.result >= 2;
    }
    
};