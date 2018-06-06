import transform from "can-key/transform/transform";

const bookshelfService = {
    toQuery(params) {
        return transform(params, {
            where: "filter",
            orderBy: "sort"
        });
    },
    toParams(query){
        return transform(query, {
            filter: "where",
            sort: "orderBy"
        });
    }
};

export default bookshelfService;
