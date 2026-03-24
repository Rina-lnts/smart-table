import './fonts/ys-display/fonts.css'
import './style.css'

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";
import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initSorting} from "./components/sorting.js";
import {initFiltering} from "./components/filtering.js";
import {initSearching} from "./components/searching.js";

const api = initData();


function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage) || 10;
    const page = parseInt(state.page ?? 1) || 1;
    return { ...state, rowsPerPage, page };
}

async function render(action) {
    let state = collectState();
    let query = {};

    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    const { total, items } = await api.getRecords(query);

    updatePagination(total, query);
    sampleTable.render(items);

    document.dispatchEvent(new CustomEvent('render-complete'));
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

const {applyPagination, updatePagination} = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        el.setAttribute('data-name', 'page');

        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const applySearching = initSearching('search');

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const {applyFiltering, updateIndexes} = initFiltering(sampleTable.filter.elements);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

async function startApp() {
    try {
        const indexes = await api.getIndexes();
        if (indexes && typeof indexes === 'object') {
            updateIndexes(indexes);
        }
    } catch (e) {
        console.warn("Не удалось загрузить индексы, но продолжаем отрисовку...");
    }
    await render();
}

startApp();