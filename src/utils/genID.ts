import path from "path";

export default function genID(fileName: string, length: number = 10) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const parsedFile = path.parse(fileName);

    const file = parsedFile.name;
    const ext = parsedFile.ext;

    return {
        fileID: result,
        file: `${file}-${result}${ext}`,
    };
}
