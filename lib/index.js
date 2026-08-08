import ApiResult from "./ApiResult.js";
import ts0, {                                   } from "@allblue/ts0";

class webABApi_Class {
    #debug         ;
    #listeners_OnError                             ;
    #requestTimeout        ;


    get Result()                   {
        return ApiResult;
    }

    get debug()          {
        return this.#debug;
    }

    get requestTimeout()         {
        return this.#requestTimeout;
    }

    constructor() {
        this.#debug = false;
        this.#listeners_OnError = null;
        this.#requestTimeout = 0;
    }

    json(uri        , json              , fn          , timeout                   = ts0.notSet) 
                 {
        var jsonString = JSON.stringify(json);
        if (jsonString === null)
            throw new Error('Cannot parse json.');

        this.post(uri, { json: jsonString }, fn, timeout);
    }

    async json_Async(uri        , json              , timeout                   = ts0.notSet) 
                               {
        return new Promise((resolve, reject) => {
            this.json(uri, json, (result) => {
                resolve(result);
            }, timeout);
        });
    }

    post(uri        , fields        , fn          , timeout                   = ts0.notSet)  
                 {
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

    setDebug(debug         )       {
        this.#debug = debug;
    }

    setOnErrorListener(onError                             )       {
        this.#listeners_OnError = onError;
    }

    setRequestTimeout(timeout        )       {
        this.#requestTimeout = timeout;
    }

    upload(uri        , json              , files                              , 
            fn          , timeout                           = ts0.notSet)       {
        var fields                                = {};
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

    async upload_Async(uri        , json              , files                              , 
            timeout                           = ts0.notSet)                     {
        return new Promise((resolve, reject) => {
            this.upload(uri, json, files, (result) => {
                resolve(result);
            }, timeout);
        });
    }


    #callResultFn(fn          , result           )       {
        try {
            fn(result);
        } catch (err     ) {
            if (this.#listeners_OnError === null)
                throw err;

            this.#listeners_OnError(err         );
        }
    }
}
const webABApi = new webABApi_Class();
export default webABApi;

                                            
                                            