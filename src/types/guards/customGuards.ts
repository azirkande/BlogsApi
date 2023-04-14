import { postSortByAvailableOptions, sortDirectionAvailableOptions } from "../../constants/constants";
import { PostSortBy, SortDirection } from "../aliasTypes";

export const isSortByOptionValid = (option: string): option is PostSortBy => {
    return postSortByAvailableOptions.indexOf(option) >= 0 ;
}

export const isSortDirectionOptionValid = (option: string): option is SortDirection => {
    return sortDirectionAvailableOptions.indexOf(option) >= 0 ;
}