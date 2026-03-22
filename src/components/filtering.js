import {createComparison, defaultRules} from "../lib/compare.js";

// #4.3 — настраиваем компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    
    // #4.1 — заполняем выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    return (data, state, action) => {
        
        // #4.2 — обработка кнопки очистки поля
        if (action && action.name === 'clear') {
            const parent = action.parentElement;
            const input = parent.querySelector('input');
            if (input) {
                input.value = '';
                state[action.dataset.field] = '';
            }
        }

        // Преобразуем totalFrom и totalTo в диапазон для поля total
        const totalFrom = parseFloat(state.totalFrom) || null;
        const totalTo = parseFloat(state.totalTo) || null;

        const modifiedState = {
            ...state,
            total: [totalFrom, totalTo]
        };

        // #4.5 — фильтруем данные
        return data.filter(row => compare(row, modifiedState));
    }
}