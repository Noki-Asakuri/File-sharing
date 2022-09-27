import path from "path";
import { v4 as uuidv4 } from "uuid";

export const genID = (fileName: string) => {
    const fileID = uuidv4().split("-")[4] as string;
    const { name, ext } = path.parse(fileName);

    return { fileID, path: `${name}-${fileID}${ext}` };
};
