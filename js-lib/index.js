'use strict';

const 
    Result = require('./Result')
;


class abApi_Class
{

    get Result() {
        return Result;
    }


    constructor()
    {
        this.requestTimeout = 30000;
    }

    json(uri, json, fn, timeout = null) 
    {
        var json_string = JSON.stringify(json);
        if (json_string === null)
            throw new Error('Cannot parse json.');

        this.post(uri, { json: json_string }, fn, timeout);
    }

    post(uri, fields, fn, timeout = null)
    {
        timeout = timeout === null ? this.requestTimeout : timeout;

        var form_data = new FormData();
        for (var field_name in fields)
            form_data.append(field_name, fields[field_name]);

        var request = new XMLHttpRequest();

        request.open('POST', uri, true);
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                var result = Result.Parse(request.responseText, uri);

                console.log(uri, result);

                fn(result);
            } else {
                if (status === 408)
                    fn(Result.ConnectionError());
                else
                    fn(Result.Error('Http request error.'));
            }
        };
        request.send(form_data);
    }

    upload(uri, json, files, fn, timeout = null)
    {
        var fields = {};
        for (var file_name in files)
            fields[file_name] = files[file_name];

        var json_string = JSON.stringify(json);
        if (json_string === null)
            throw new Error('Cannot parse json.');
        fields.json = json_string;

        this.post(uri, fields, fn, timeout);
    }

}
module.exports = new abApi_Class();