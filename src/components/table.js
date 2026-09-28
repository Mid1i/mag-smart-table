import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    before.reverse().forEach(item => {
        root[item] = cloneTemplate(item);
        root.container.prepend(root[item].container);
    });

    after.forEach(item => {
        root[item] = cloneTemplate(item);
        root.container.appendChild(root[item].container);
    });

    root.container.addEventListener("change", () => onAction());
    root.container.addEventListener("reset", () => setTimeout(onAction));
    
    root.container.addEventListener("submit", (event) => {
        event.preventDefault();
        onAction(event.submitter);
    })


    const render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            
            Object.keys(item).forEach(key => {
                const el = row.elements[key];
                if (!el) return;
                
                const hasValueAttr = el.tagName === "INPUT" || el.tagName === "SELECT";

                if (hasValueAttr) {
                    el.value = item[key];
                } else {
                    el.textContent = item[key];
                }
            });
            
            return row.container;
        });

        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}