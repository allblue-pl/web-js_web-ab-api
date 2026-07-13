import type { TS0RawObject } from "@allblue/ts0"

export type ErrorInfo = {
    title: string,
    message: string,
};

export type ResultData = {
    result: number,
    message: string,
    data: TS0RawObject|string|null,
};