import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // #5.1 — настраиваем компаратор для поиска
    const compare = createComparison(
        [rules.skipEmptyTargetValues],
        [rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)]
    );

    return (data, state, action) => {
        // #5.2 — применяем компаратор
        return data.filter(row => compare(row, state));
    }
}