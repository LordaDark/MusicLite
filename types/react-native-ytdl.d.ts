declare module 'react-native-ytdl' {
    export function getInfo(url: string, options?: any): Promise<any>;
    export function chooseFormat(formats: any[], options: any): any;
    export function validateURL(url: string): boolean;
}
