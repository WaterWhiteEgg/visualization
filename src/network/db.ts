import { postRequest } from "./index";

export const commitUser = (json: object) => {
    return postRequest({
        url: "/db/test",
        data: json
    });
};