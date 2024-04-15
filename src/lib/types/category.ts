export type CategoryData = {
    value: string;
    label: string;
    children?: {
        value: string;
        label: string;
    }[];
};