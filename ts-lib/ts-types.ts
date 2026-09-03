import type { TS0RawObject, TS0RawValue } from "@allblue/ts0"

export type ErrorInfo = {
    title: string,
    message: string,
};

export type ResultData = {
    result: -1|0|1|2|3|4|5|6,
    message: string,
    [key: string]: TS0RawValue,
};