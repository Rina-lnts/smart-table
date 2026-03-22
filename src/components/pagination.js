import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    
    // #2.3 — берём первую кнопку как шаблон и удаляем её из контейнера
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    return (data, state, action) => {
        
        // #2.1 — считаем количество страниц и объявляем переменные
    const rowsPerPage = state.rowsPerPage || 10;
    const pageCount = Math.ceil(data.length / rowsPerPage);
    let page = state.page || 1;
    console.log('data.length:', data.length, 'rowsPerPage:', rowsPerPage, 'pageCount:', pageCount);

        // #2.6 — обрабатываем кнопки "вперёд/назад/первая/последняя"
        if (action) switch(action.name) {
            case 'prev':  page = Math.max(1, page - 1); break;
            case 'next':  page = Math.min(pageCount, page + 1); break;
            case 'first': page = 1; break;
            case 'last':  page = pageCount; break;
        }

        // #2.4 — выводим кнопки страниц
        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }));

        // #2.5 — обновляем статус "Showing 1 to 10 of 200"
        fromRow.textContent = (page - 1) * rowsPerPage + 1;
        toRow.textContent = Math.min(page * rowsPerPage, data.length);
        totalRows.textContent = data.length;

        // #2.2 — возвращаем только строки текущей страницы
        const skip = (page - 1) * rowsPerPage;
        return data.slice(skip, skip + rowsPerPage);
    }
}