import { key } from "can";

const bookshelfService = {
    toQuery(params) {
        return key.transform(params, {
            where: "filter",
            orderBy: "sort"
        });
    },
    toParams(query){
        return key.transform(query, {
            filter: "where",
            sort: "orderBy"
        });
    }
};

export default bookshelfService;
