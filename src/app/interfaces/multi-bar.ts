import { SingleBar } from "./single-bar";

export interface MultiBar {
    name: string,
    series: SingleBar[]
}