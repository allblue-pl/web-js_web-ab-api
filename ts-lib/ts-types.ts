import type { TS0RawObject, TS0RawValue } from "@allblue/ts0"

export type ErrorInfo = {
    title: string,
    message: string,
};

export type ResultData = {
    result: number,
    message: string,
    [key: string]: TS0RawValue,
};