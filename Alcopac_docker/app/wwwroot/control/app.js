const pages = {};
let rootCustomtItems = null;
let rootDefaultItems = null;
fetch('/admin/init/default')
    .then(res => res.json())
    .then(ob => {
    rootDefaultItems = ob;
});
function navigate(page) {
    const content = document.getElementById('content');
    if (!content)
        return;
    if (page === 'users') {
        renderUsersPage('content');
    }
    else if (page === 'online') {
        renderOnlinePage('content');
    }
    else if (page === 'proxy') {
        renderProxiesPage('content');
    }
    else if (page === 'other') {
        renderOtherPage('content');
    }
    else {
        renderEditorPage('content');
    }
}
function saveCustomtItems() {
    const sendData = new FormData();
    sendData.append('json', JSON.stringify(rootCustomtItems, null, 2));
    fetch('/admin/init/save', {
        method: 'POST',
        body: sendData
    })
        .then(async (response) => {
        if (response.ok) {
            const data = await response.json();
            if (data && data.success === true) {
                showToast('Данные успешно сохранены');
            }
            else {
                alert('Ошибка: сервер не подтвердил сохранение');
            }
        }
        else {
            alert('Ошибка при сохранении данных');
        }
    })
        .catch(() => {
        alert('Ошибка при отправке запроса');
    });
}
function escapeHtmlAttr(str) {
    if (str === null || str === undefined)
        return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
function showToast(message) {
    // Создаём контейнер для тостов, если его нет
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.position = 'fixed';
        toastContainer.style.bottom = '1rem';
        toastContainer.style.right = '1rem';
        toastContainer.style.zIndex = '1080';
        document.body.appendChild(toastContainer);
    }
    // Всегда зелёный цвет
    const bgClass = 'bg-success';
    const textClass = 'text-white';
    const toastId = 'toast-' + Date.now() + Math.floor(Math.random() * 1000);
    toastContainer.insertAdjacentHTML('beforeend', `
        <div id="${toastId}" class="toast align-items-center ${bgClass} ${textClass}" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000" style="min-width:220px;">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Закрыть"></button>
            </div>
        </div>
    `);
    // @ts-ignore
    const toastEl = document.getElementById(toastId);
    // @ts-ignore
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    // Удаляем DOM после скрытия
    if (toastEl) {
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    }
}
// Инициализация по умолчанию
window.onload = () => navigate('home');
function formatDate(dateStr) {
    if (!dateStr)
        return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime()))
        return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}
function getUserModalHtml(modalId, title, user, nextMonthDate, showDelete = false, showBanFields = true // новый параметр
) {
    return `
    <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="${modalId}Label">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <form id="${modalId}-form">
              <div class="mb-3">
                <label for="${modalId}-user-id" class="form-label">ID</label>
                <input type="text" class="form-control" id="${modalId}-user-id" value="${user ? (user.id || '') : ''}" placeholder="unic_id, token, email, пароль" required>
              </div>
              <div class="mb-3">
                <label for="${modalId}-user-ids" class="form-label">IDs (через запятую)</label>
                <input type="text" class="form-control" id="${modalId}-user-ids" value="${user ? (user.ids ? user.ids.join(', ') : '') : ''}" placeholder="uid-1, uid-2, token">
              </div>
              <div class="mb-3">
                <label for="${modalId}-user-expires" class="form-label">Доступ до (ГГГГ-ММ-ДД)</label>
                <input type="date" class="form-control" id="${modalId}-user-expires" value="${user ? (user.expires ? user.expires.substring(0, 10) : '') : (nextMonthDate || '')}" required>
              </div>
              <div class="mb-3">
                <label for="${modalId}-user-group" class="form-label">Группа доступа</label>
                <input type="number" class="form-control" id="${modalId}-user-group" value="${user ? user.group : 1}" required>
              </div>
              <div class="mb-3">
                <label for="${modalId}-user-comment" class="form-label">Комментарий для себя</label>
                <input type="text" class="form-control" id="${modalId}-user-comment" value="${user ? (user.comment || '') : ''}" placeholder="контакты пользователя, etc">
              </div>
              ${showBanFields ? `
              <div class="mb-3 mt-5">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="${modalId}-user-ban" ${user && user.ban ? 'checked' : ''}>
                  <label class="form-check-label" for="${modalId}-user-ban">Заблокировать доступ</label>
                </div>
              </div>
              <div class="mb-3">
                <input type="text" class="form-control" id="${modalId}-user-ban-msg" value="${user ? (user.ban_msg || '') : ''}" placeholder="сообщение которое видит пользователь">
              </div>
              ` : ''}
            </form>
            ${showDelete ? `<button type="button" class="btn btn-warning" id="${modalId}-params-btn">params</button>` : '<span></span>'}
          </div>
          <div class="modal-footer d-flex justify-content-between">
            ${showDelete ? `<button type="button" class="btn btn-danger" id="${modalId}-delete-btn">Удалить</button>` : '<span></span>'}
            <div>
              <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Закрыть</button>
              <button type="button" class="btn btn-primary" id="${modalId}-save-btn">Сохранить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
}
function renderUsersPage(containerId) {
    const container = document.getElementById(containerId);
    if (!container)
        return;
    // Получаем дату +1 месяц от текущей
    function getNextMonthDate() {
        const now = new Date();
        const year = now.getFullYear();
        let month = now.getMonth() + 2;
        let nextYear = year;
        if (month > 12) {
            month = 1;
            nextYear++;
        }
        const day = String(now.getDate()).padStart(2, '0');
        return `${nextYear}-${String(month).padStart(2, '0')}-${day}`;
    }
    const nextMonthDate = getNextMonthDate();
    // Модальное окно для добавления пользователя (без полей ban и ban_msg)
    const addModalHtml = getUserModalHtml('addUserModal', 'Добавить пользователя', undefined, nextMonthDate, false, false);
    const promoModalHtml = `
    <div class="modal fade" id="promoModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Промокоды</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <div class="row g-2 mb-3">
              <div class="col-auto">
                <label class="form-label mb-1">Кол-во</label>
                <input type="number" class="form-control form-control-sm" id="promo-count" value="1" min="1" max="100" style="width:80px">
              </div>
              <div class="col-auto">
                <label class="form-label mb-1">Дней доступа</label>
                <input type="number" class="form-control form-control-sm" id="promo-days" value="30" min="1" style="width:90px">
              </div>
              <div class="col-auto">
                <label class="form-label mb-1">Макс. исп.</label>
                <input type="number" class="form-control form-control-sm" id="promo-max-uses" value="1" min="0" style="width:80px" title="0 = безлимит">
              </div>
              <div class="col-auto">
                <label class="form-label mb-1">Срок (часы)</label>
                <input type="number" class="form-control form-control-sm" id="promo-valid-hours" value="0" min="0" style="width:90px" title="0 = бессрочно">
              </div>
              <div class="col-auto d-flex align-items-end">
                <button class="btn btn-success btn-sm" id="promo-generate-btn">Сгенерировать</button>
              </div>
            </div>
            <div id="promo-list-container"><div class="text-muted">Загрузка...</div></div>
          </div>
        </div>
      </div>
    </div>`;
    container.innerHTML = `
        ${addModalHtml}
        ${promoModalHtml}
        <div id="edit-user-modal-container"></div>
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="mb-0">Пользователи</h1>
            <div>
                <button type="button" class="btn btn-success" id="btn-add-user">Добавить пользователя</button>
                <button type="button" class="btn btn-outline-primary ms-2" id="btn-promo">Промокоды</button>
                <button type="button" class="btn btn-light ms-2" id="btn-users-settings" title="Настройки" style="vertical-align: middle;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                    </svg>
                </button>
                <button type="button" class="btn btn-primary" id="btn-save-users" style="display: none;">Сохранить</button>
            </div>
        </div>
        <div id="users-list" class="row g-3"></div>
    `;
    loadAndRenderUsers('users-list');
    setTimeout(() => {
        // Кнопка "Сохранить"
        const btnSave = document.getElementById('btn-save-users');
        if (btnSave) {
            btnSave.onclick = () => {
                if (rootCustomtItems) {
                    saveCustomtItems();
                }
                else {
                    alert('Данные не загружены');
                }
            };
        }
        // Кнопка "Добавить"
        const btnAdd = document.getElementById('btn-add-user');
        if (btnAdd) {
            btnAdd.onclick = () => {
                // @ts-ignore
                const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
                modal.show();
            };
        }
        // Кнопка "Промокоды"
        const btnPromo = document.getElementById('btn-promo');
        if (btnPromo) {
            btnPromo.onclick = () => {
                // @ts-ignore
                const modal = new bootstrap.Modal(document.getElementById('promoModal'));
                modal.show();
                loadPromoList();
            };
        }
        // Генерация промокодов
        const promoGenBtn = document.getElementById('promo-generate-btn');
        if (promoGenBtn) {
            promoGenBtn.onclick = async () => {
                const count = parseInt(document.getElementById('promo-count').value) || 1;
                const days = parseInt(document.getElementById('promo-days').value) || 30;
                const maxUses = parseInt(document.getElementById('promo-max-uses').value) || 1;
                const validHours = parseInt(document.getElementById('promo-valid-hours').value) || 0;
                try {
                    const resp = await fetch('api/promo', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'generate', count, days, max_uses: maxUses, valid_hours: validHours })
                    });
                    const data = await resp.json();
                    if (data.ok) {
                        loadPromoList();
                    }
                    else {
                        alert(data.error || 'Ошибка генерации');
                    }
                }
                catch (e) {
                    alert('Ошибка сети');
                }
            };
        }
        // Кнопка "Сохранить" в модальном окне добавления
        const saveUserBtn = document.getElementById('addUserModal-save-btn');
        if (saveUserBtn) {
            saveUserBtn.onclick = () => {
                const id = document.getElementById('addUserModal-user-id').value.trim();
                const idsRaw = document.getElementById('addUserModal-user-ids').value.trim();
                const expires = document.getElementById('addUserModal-user-expires').value;
                const group = parseInt(document.getElementById('addUserModal-user-group').value, 10);
                const comment = document.getElementById('addUserModal-user-comment').value.trim();
                if (!id || !expires || isNaN(group)) {
                    alert('Пожалуйста, заполните все обязательные поля');
                    return;
                }
                const ids = idsRaw ? idsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
                const newUser = {
                    id,
                    ids,
                    expires: expires + "T00:00:00",
                    group,
                    comment
                };
                if (window.invc)
                    window.invc.newUser(newUser);
                if (rootCustomtItems && rootCustomtItems["accsdb"] && Array.isArray(rootCustomtItems["accsdb"]["users"])) {
                    rootCustomtItems["accsdb"]["users"].push(newUser);
                    // Перерисовать таблицу
                    const usersList = document.getElementById('users-list');
                    if (usersList) {
                        usersList.innerHTML = renderUsers(rootCustomtItems["accsdb"]["users"]);
                        attachEditHandlers(rootCustomtItems["accsdb"]["users"]);
                    }
                }
                // Закрыть модальное окно
                // @ts-ignore
                const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
                if (modal)
                    modal.hide();
                // Автоматически кликнуть по кнопке "Сохранить"
                saveCustomtItems();
            };
        }
        // После первой загрузки пользователей навесить обработчики
        if (rootCustomtItems && rootCustomtItems["accsdb"] && Array.isArray(rootCustomtItems["accsdb"]["users"])) {
            attachEditHandlers(rootCustomtItems["accsdb"]["users"]);
        }
        // Модальное окно для настроек accsdb
        if (!document.getElementById('accsdb-settings-modal')) {
            const modalHtml = `
                <div class="modal fade" id="accsdb-settings-modal" tabindex="-1" aria-labelledby="accsdbSettingsLabel" aria-hidden="true">
                  <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="accsdbSettingsLabel">Настройки accsdb</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                      </div>
                      <div class="modal-body">
                        <form id="accsdb-settings-form">
                          <div class="row g-2">
                            <div class="col-6 mb-2">
                              <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="accsdb-enable">
                                <label class="form-check-label" for="accsdb-enable">Включить авторизацию</label>
                              </div>
                            </div>
                            <div class="col-6 mb-2">
                              <label class="form-label" for="accsdb-whitepattern">whitepattern</label>
                              <input type="text" class="form-control" id="accsdb-whitepattern">
                            </div>
                            <div class="col-6 mb-2 mb-5">
                              <label class="form-label" for="accsdb-premium_pattern">premium_pattern</label>
                              <input type="text" class="form-control" id="accsdb-premium_pattern">
                            </div>
                            <div class="col-6 mb-2">
                              <label class="form-label" for="accsdb-domainId_pattern">domainId_pattern</label>
                              <input type="text" class="form-control" id="accsdb-domainId_pattern">
                            </div>
                            <div class="col-6 mb-2">
                              <label class="form-label" for="accsdb-maxip_hour">Лимит ip в час</label>
                              <input type="number" class="form-control" id="accsdb-maxip_hour">
                            </div>
                            <div class="col-6 mb-2">
                              <label class="form-label" for="accsdb-maxrequest_hour">Лимит запросов в час</label>
                              <input type="number" class="form-control" id="accsdb-maxrequest_hour">
                            </div>
                            <div class="col-12 mb-2">
                              <label class="form-label" for="accsdb-maxlock_day">Лимит блокировок в сутки (maxlock_day)</label>
                              <input type="number" class="form-control" id="accsdb-maxlock_day">
                            </div>
                            <div class="col-12 mb-2">
                              <label class="form-label" for="accsdb-blocked_hour">На сколько часов блокировать при достижении лимита maxlock_day</label>
                              <input type="number" class="form-control" id="accsdb-blocked_hour">
                            </div>
                            <div class="col-12 mb-2 mt-5">
                              <label class="form-label" for="accsdb-authMesage">Ошибка - нету идентификатора uid, token, email</label>
                              <input type="text" class="form-control" id="accsdb-authMesage">
                            </div>
                            <div class="col-12 mb-2">
                              <label class="form-label" for="accsdb-denyMesage">Ошибка - нету доступа</label>
                              <input type="text" class="form-control" id="accsdb-denyMesage">
                            </div>
                            <div class="col-12 mb-2">
                              <label class="form-label" for="accsdb-denyGroupMesage">Ошибка - группа пользователя ниже group балансера</label>
                              <input type="text" class="form-control" id="accsdb-denyGroupMesage">
                            </div>
                            <div class="col-12 mb-2">
                              <label class="form-label" for="accsdb-expiresMesage">Ошибка - закончился доступ</label>
                              <input type="text" class="form-control" id="accsdb-expiresMesage">
                            </div>
                          </div>
                        </form>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Закрыть</button>
                        <button type="button" class="btn btn-primary" id="accsdb-settings-save-btn">Сохранить</button>
                      </div>
                    </div>
                  </div>
                </div>
                `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }
        // Открытие модального окна и заполнение полей
        const btnSettings = document.getElementById('btn-users-settings');
        if (btnSettings) {
            btnSettings.onclick = function () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
                const accsdb = rootCustomtItems && rootCustomtItems.accsdb ? rootCustomtItems.accsdb : {};
                document.getElementById('accsdb-enable').checked = !!accsdb.enable;
                document.getElementById('accsdb-whitepattern').value = (_a = accsdb.whitepattern) !== null && _a !== void 0 ? _a : '';
                document.getElementById('accsdb-premium_pattern').value = (_b = accsdb.premium_pattern) !== null && _b !== void 0 ? _b : '';
                document.getElementById('accsdb-domainId_pattern').value = (_c = accsdb.domainId_pattern) !== null && _c !== void 0 ? _c : '';
                document.getElementById('accsdb-maxip_hour').value = (_d = accsdb.maxip_hour) !== null && _d !== void 0 ? _d : '';
                document.getElementById('accsdb-maxrequest_hour').value = (_e = accsdb.maxrequest_hour) !== null && _e !== void 0 ? _e : '';
                document.getElementById('accsdb-maxlock_day').value = (_f = accsdb.maxlock_day) !== null && _f !== void 0 ? _f : '';
                document.getElementById('accsdb-blocked_hour').value = (_g = accsdb.blocked_hour) !== null && _g !== void 0 ? _g : '';
                document.getElementById('accsdb-authMesage').value = (_h = accsdb.authMesage) !== null && _h !== void 0 ? _h : '';
                document.getElementById('accsdb-denyMesage').value = (_j = accsdb.denyMesage) !== null && _j !== void 0 ? _j : '';
                document.getElementById('accsdb-denyGroupMesage').value = (_k = accsdb.denyGroupMesage) !== null && _k !== void 0 ? _k : '';
                document.getElementById('accsdb-expiresMesage').value = (_l = accsdb.expiresMesage) !== null && _l !== void 0 ? _l : '';
                const accsDefault = rootDefaultItems && rootDefaultItems.accsdb ? rootDefaultItems.accsdb : {};
                document.getElementById('accsdb-whitepattern').placeholder = (_m = accsDefault.whitepattern) !== null && _m !== void 0 ? _m : '';
                document.getElementById('accsdb-premium_pattern').placeholder = (_o = accsDefault.premium_pattern) !== null && _o !== void 0 ? _o : '';
                document.getElementById('accsdb-domainId_pattern').placeholder = (_p = accsDefault.domainId_pattern) !== null && _p !== void 0 ? _p : '';
                document.getElementById('accsdb-maxip_hour').placeholder = (_q = accsDefault.maxip_hour) !== null && _q !== void 0 ? _q : '';
                document.getElementById('accsdb-maxrequest_hour').placeholder = (_r = accsDefault.maxrequest_hour) !== null && _r !== void 0 ? _r : '';
                document.getElementById('accsdb-maxlock_day').placeholder = (_s = accsDefault.maxlock_day) !== null && _s !== void 0 ? _s : '';
                document.getElementById('accsdb-blocked_hour').placeholder = (_t = accsDefault.blocked_hour) !== null && _t !== void 0 ? _t : '';
                document.getElementById('accsdb-authMesage').placeholder = (_u = accsDefault.authMesage) !== null && _u !== void 0 ? _u : '';
                document.getElementById('accsdb-denyMesage').placeholder = (_v = accsDefault.denyMesage) !== null && _v !== void 0 ? _v : '';
                document.getElementById('accsdb-denyGroupMesage').placeholder = (_w = accsDefault.denyGroupMesage) !== null && _w !== void 0 ? _w : '';
                document.getElementById('accsdb-expiresMesage').placeholder = (_x = accsDefault.expiresMesage) !== null && _x !== void 0 ? _x : '';
                // @ts-ignore
                const modal = new bootstrap.Modal(document.getElementById('accsdb-settings-modal'));
                modal.show();
            };
        }
        // Сохранение изменений
        const accsdbSaveBtn = document.getElementById('accsdb-settings-save-btn');
        if (accsdbSaveBtn) {
            accsdbSaveBtn.onclick = function () {
                if (!rootCustomtItems)
                    return;
                if (!rootCustomtItems.accsdb)
                    rootCustomtItems.accsdb = {};
                const accsdb = rootCustomtItems.accsdb;
                accsdb.enable = document.getElementById('accsdb-enable').checked;
                accsdb.whitepattern = document.getElementById('accsdb-whitepattern').value;
                accsdb.premium_pattern = document.getElementById('accsdb-premium_pattern').value || null;
                accsdb.domainId_pattern = document.getElementById('accsdb-domainId_pattern').value || null;
                accsdb.maxip_hour = parseInt(document.getElementById('accsdb-maxip_hour').value, 10) || 0;
                accsdb.maxrequest_hour = parseInt(document.getElementById('accsdb-maxrequest_hour').value, 10) || 0;
                accsdb.maxlock_day = parseInt(document.getElementById('accsdb-maxlock_day').value, 10) || 0;
                accsdb.blocked_hour = parseInt(document.getElementById('accsdb-blocked_hour').value, 10) || 0;
                accsdb.authMesage = document.getElementById('accsdb-authMesage').value;
                accsdb.denyMesage = document.getElementById('accsdb-denyMesage').value;
                accsdb.denyGroupMesage = document.getElementById('accsdb-denyGroupMesage').value;
                accsdb.expiresMesage = document.getElementById('accsdb-expiresMesage').value;
                // Удаление переменных с пустыми или дефолтными значениями
                const defaults = {
                    enable: false,
                    whitepattern: '',
                    premium_pattern: null,
                    domainId_pattern: null,
                    maxip_hour: 0,
                    maxrequest_hour: 0,
                    maxlock_day: 0,
                    blocked_hour: 0,
                    authMesage: '',
                    denyMesage: '',
                    denyGroupMesage: '',
                    expiresMesage: ''
                };
                Object.keys(defaults).forEach(key => {
                    const value = accsdb[key];
                    const def = defaults[key];
                    if (value === undefined ||
                        value === null ||
                        (typeof def === 'string' && (value === '' || value === def)) ||
                        (typeof def === 'number' && value === def) ||
                        (typeof def === 'boolean' && value === def)) {
                        delete accsdb[key];
                    }
                });
                // @ts-ignore
                const modal = bootstrap.Modal.getInstance(document.getElementById('accsdb-settings-modal'));
                if (modal)
                    modal.hide();
                saveCustomtItems();
            };
        }
    }, 0);
}
function attachEditHandlers(users) {
    users.forEach((user, idx) => {
        const btn = document.getElementById(`edit-user-btn-${idx}`);
        if (btn) {
            btn.onclick = () => {
                const editModalId = `editUserModal-${idx}`;
                const editModalHtml = getUserModalHtml(editModalId, 'Редактировать пользователя', user, undefined, true);
                const editModalContainer = document.getElementById('edit-user-modal-container');
                if (editModalContainer) {
                    editModalContainer.innerHTML = editModalHtml;
                }
                // @ts-ignore
                const modal = new bootstrap.Modal(document.getElementById(editModalId));
                modal.show();
                setTimeout(() => {
                    const editParamsBtn = document.getElementById(`${editModalId}-params-btn`);
                    if (editParamsBtn) {
                        editParamsBtn.onclick = () => {
                            if (window.invc)
                                window.invc.editUser(user);
                        };
                    }
                    const saveBtn = document.getElementById(`${editModalId}-save-btn`);
                    if (saveBtn) {
                        saveBtn.onclick = () => {
                            const id = document.getElementById(`${editModalId}-user-id`).value.trim();
                            const idsRaw = document.getElementById(`${editModalId}-user-ids`).value.trim();
                            const expires = document.getElementById(`${editModalId}-user-expires`).value;
                            const group = parseInt(document.getElementById(`${editModalId}-user-group`).value, 10);
                            const comment = document.getElementById(`${editModalId}-user-comment`).value.trim();
                            const ban = document.getElementById(`${editModalId}-user-ban`).checked;
                            const ban_msg = document.getElementById(`${editModalId}-user-ban-msg`).value.trim();
                            if (!id || !expires || isNaN(group)) {
                                alert('Пожалуйста, заполните все обязательные поля');
                                return;
                            }
                            const ids = idsRaw ? idsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
                            user.id = id;
                            user.ids = ids;
                            user.expires = expires + "T00:00:00";
                            user.group = group;
                            user.comment = comment;
                            user.ban = ban;
                            user.ban_msg = ban_msg;
                            const usersList = document.getElementById('users-list');
                            if (usersList) {
                                usersList.innerHTML = renderUsers(rootCustomtItems["accsdb"]["users"]);
                                attachEditHandlers(rootCustomtItems["accsdb"]["users"]);
                            }
                            // @ts-ignore
                            const modal = bootstrap.Modal.getInstance(document.getElementById(editModalId));
                            if (modal)
                                modal.hide();
                            saveCustomtItems();
                        };
                    }
                    // Обработчик для кнопки "Удалить"
                    const deleteBtn = document.getElementById(`${editModalId}-delete-btn`);
                    if (deleteBtn) {
                        deleteBtn.onclick = () => {
                            if (confirm('Удалить пользователя?')) {
                                if (rootCustomtItems && rootCustomtItems["accsdb"] && Array.isArray(rootCustomtItems["accsdb"]["users"])) {
                                    const usersArr = rootCustomtItems["accsdb"]["users"];
                                    const userIdx = usersArr.indexOf(user);
                                    if (userIdx !== -1) {
                                        usersArr.splice(userIdx, 1);
                                        const usersList = document.getElementById('users-list');
                                        if (usersList) {
                                            usersList.innerHTML = renderUsers(usersArr);
                                            attachEditHandlers(usersArr);
                                        }
                                        // @ts-ignore
                                        const modal = bootstrap.Modal.getInstance(document.getElementById(editModalId));
                                        if (modal)
                                            modal.hide();
                                        saveCustomtItems();
                                    }
                                }
                            }
                        };
                    }
                }, 0);
            };
        }
    });
}
function loadAndRenderUsers(containerId) {
    const container = document.getElementById(containerId);
    if (!container)
        return;
    // Сначала загружаем custom, затем current
    fetch('/admin/init/custom')
        .then(res => res.json())
        .then(ob => {
        rootCustomtItems = ob;
        // Теперь загружаем current
        return fetch('/admin/init/current');
    })
        .then(res => res.json())
        .then(ob => {
        // Проверяем наличие accsdb
        if (!rootCustomtItems.accsdb)
            rootCustomtItems.accsdb = {};
        rootCustomtItems.accsdb.users = ob.accsdb && Array.isArray(ob.accsdb.users) ? ob.accsdb.users : [];
        // Сортировка по user.expires (по возрастанию даты, пустые в конце)
        rootCustomtItems.accsdb.users = [...rootCustomtItems.accsdb.users].sort((a, b) => {
            const aDate = a.expires ? new Date(a.expires).getTime() : Infinity;
            const bDate = b.expires ? new Date(b.expires).getTime() : Infinity;
            return aDate - bDate;
        });
        container.innerHTML = renderUsers(rootCustomtItems.accsdb.users);
        // После рендера таблицы навесить обработчики на кнопки "Редактировать"
        setTimeout(() => {
            if (rootCustomtItems && rootCustomtItems.accsdb && Array.isArray(rootCustomtItems.accsdb.users)) {
                attachEditHandlers(rootCustomtItems.accsdb.users);
            }
        }, 0);
    })
        .catch(() => {
        container.innerHTML = '<div class="alert alert-danger">Ошибка загрузки пользователей</div>';
    });
}
function renderUsers(users) {
    // Получаем текущую дату без времени для сравнения
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return `
        <table class="table table-bordered table-striped align-middle">
            <thead>
                <tr>
                    <th style="width:48px; text-align:center;"></th>
                    <th>ID</th>
                    <th>IDs</th>
                    <th>Истекает</th>
                    <th>Группа</th>
                    <th>Комментарий</th>
                    <th>Заблокирован</th>
                    <th>ban_msg</th>
                </tr>
            </thead>
            <tbody>
                ${users.map((user, idx) => {
        // Проверка на просроченность и "оранжевый" статус
        let isExpired = false;
        let isWarning = false;
        if (user.expires) {
            const expiresDate = new Date(user.expires);
            expiresDate.setHours(0, 0, 0, 0);
            isExpired = expiresDate < now;
            // Проверка на "оранжевый" (меньше 30 дней, но не просрочен)
            const diffDays = Math.ceil((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            isWarning = !isExpired && diffDays <= 30;
        }
        // Проверка на бан
        const isBanned = !!user.ban;
        // Классы для выделения
        let expiresClass = '';
        if (isExpired) {
            expiresClass = 'style="background:#ffdddd;"';
        }
        else if (isWarning) {
            expiresClass = 'style="background:#fff3cd;"'; // Bootstrap warning (light orange)
        }
        const banClass = isBanned ? 'style="background:#ffdddd;"' : '';
        return `
                        <tr>
                            <td style="width:48px; text-align:center;">
                                <button type="button" class="btn btn-sm btn-light p-1" id="edit-user-btn-${idx}" title="Редактировать" style="width:32px; height:32px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
                                      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                                      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                                    </svg>
                                </button>
                            </td>
                            <td>${user.id || 'не указан'}</td>
                            <td>${Array.isArray(user.ids) ? user.ids.join('<br>') : ''}</td>
                            <td ${expiresClass}>${user.expires ? formatDate(user.expires) : ''}</td>
                            <td>${user.group || 0}</td>
                            <td>${user.comment || ''}</td>
                            <td ${banClass}>${user.ban ? 'Да' : 'Нет'}</td>
                            <td>${user.ban_msg || ''}</td>
                        </tr>
                    `;
    }).join('')}
            </tbody>
        </table>
    `;
}
async function loadPromoList() {
    const container = document.getElementById('promo-list-container');
    if (!container)
        return;
    container.innerHTML = '<div class="text-muted">Загрузка...</div>';
    try {
        const resp = await fetch('api/promo');
        const codes = await resp.json();
        if (!codes || codes.length === 0) {
            container.innerHTML = '<div class="text-muted">Нет промокодов</div>';
            return;
        }
        container.innerHTML = `
            <table class="table table-sm table-bordered">
                <thead>
                    <tr>
                        <th>Код</th>
                        <th>Дней</th>
                        <th>Исп.</th>
                        <th>Макс.</th>
                        <th>Создан</th>
                        <th>Истекает</th>
                        <th>Статус</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${codes.map(c => `
                        <tr>
                            <td><code>${c.code}</code></td>
                            <td>${c.days}</td>
                            <td>${c.used_count}</td>
                            <td>${c.max_uses || '∞'}</td>
                            <td>${c.created_at || ''}</td>
                            <td>${c.expires_at || '—'}</td>
                            <td>${c.valid ? '<span class="badge bg-success">Активен</span>' : '<span class="badge bg-secondary">Недейств.</span>'}</td>
                            <td><button class="btn btn-sm btn-outline-danger" onclick="deletePromo('${c.code}')">✕</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    catch (e) {
        container.innerHTML = '<div class="text-danger">Ошибка загрузки</div>';
    }
}
// @ts-ignore
window.deletePromo = async function (code) {
    if (!confirm('Удалить промокод ' + code + '?'))
        return;
    try {
        const resp = await fetch('api/promo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', code })
        });
        const data = await resp.json();
        if (data.ok) {
            loadPromoList();
        }
        else {
            alert(data.error || 'Ошибка удаления');
        }
    }
    catch (e) {
        alert('Ошибка сети');
    }
};
// Массив балансеров будет формироваться динамически
let balancers = [];
function loadCustomAndCurrent(container, onLoaded) {
    function checkLoaded() {
        if (onLoaded) {
            // Формируем balancers только после загрузки rootDefaultItems
            if (rootDefaultItems) {
                balancers = Object.keys(rootDefaultItems).filter(key => rootDefaultItems[key] && typeof rootDefaultItems[key].kit !== 'undefined' && rootDefaultItems[key].rip !== true);
            }
            else {
                balancers = [];
            }
            onLoaded();
        }
    }
    fetch('/admin/init/custom')
        .then(res => res.json())
        .then(ob => {
        rootCustomtItems = ob;
        checkLoaded();
    })
        .catch(() => {
        if (container) {
            container.innerHTML = `<div class="alert alert-danger">Ошибка загрузки rootCustomtItems</div>`;
        }
    });
}
function renderOnlinePage(containerId) {
    const container = document.getElementById(containerId);
    if (!container)
        return;
    // Базовые поля по умолчанию
    const defaultBalancer = {
        host: "",
        apihost: "",
        scheme: "",
        cookie: "",
        token: "",
        overridehost: "",
        overridehosts: [""],
        overridepasswd: "",
        displayname: "",
        displayindex: 0,
        webcorshost: "",
        globalnameproxy: "",
        geostreamproxy: [""],
        group: 0,
        geo_hide: [""],
        client_type: "",
        cache_time: 0,
        rhub_geo_disable: [""],
        priorityBrowser: "",
        vast: {
            url: "",
            msg: ""
        },
        headers: {},
        headers_stream: {},
    };
    // Ключи, которые нужно игнорировать при выводе и сохранении
    const ignoreKeys = ['rip', 'proxy', 'plugin', 'apn'];
    const ignoreSaveKeys = ['headers', 'headers_stream'];
    // Функция для рендера формы по balancer
    function renderBalancerForm(balancer) {
        let balancerDefaults = Object.assign({}, defaultBalancer);
        if (balancer === "FilmixTV") {
            balancerDefaults = Object.assign({ user_apitv: "", passwd_apitv: "", tokens: [""] }, balancerDefaults);
        }
        else if (balancer === "FilmixPartner") {
            balancerDefaults = Object.assign(Object.assign({ APIKEY: "", APISECRET: "", user_name: "", user_passw: "", lowlevel_api_passw: "" }, balancerDefaults), { tokens: [""] });
        }
        else if (balancer === "Rezka" || balancer === "RezkaPrem") {
            balancerDefaults = Object.assign({ login: "", passwd: "" }, balancerDefaults);
        }
        else if (balancer === "VideoCDN") {
            balancerDefaults = Object.assign({ clientId: "", iframehost: "", username: "", password: "", domain: "" }, balancerDefaults);
        }
        else if (balancer === "KinoPub") {
            balancerDefaults = Object.assign({ filetype: "", tokens: [""] }, balancerDefaults);
        }
        else if (balancer === "Alloha" || balancer === "Mirage" || balancer === "Kodik") {
            balancerDefaults = Object.assign({ secret_token: "", linkhost: "" }, balancerDefaults);
        }
        const current = (rootDefaultItems && rootDefaultItems[balancer]) ? rootDefaultItems[balancer] : {};
        const custom = (rootCustomtItems && rootCustomtItems[balancer]) ? rootCustomtItems[balancer] : {};
        const allKeys = Array.from(new Set([
            ...Object.keys(balancerDefaults),
            ...Object.keys(current),
            ...Object.keys(custom)
        ])).filter(key => !ignoreKeys.includes(key));
        const data = Object.assign(Object.assign({}, balancerDefaults), current);
        const mainContent = document.getElementById('online-main-content');
        if (!mainContent)
            return;
        function renderObjectAsText(obj) {
            if (!obj)
                return '';
            return Object.entries(obj)
                .map(([k, v]) => `<b>${k}</b>: ${JSON.stringify(v)}`)
                .join(',<br>');
        }
        // Ключи, для которых нужно добавить "- через запятую"
        const arrayCommaKeys = ['rhub_geo_disable', 'geo_hide', 'overridehosts', 'geostreamproxy', 'tokens'];
        mainContent.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h1 class="mb-0">${balancer}</h1>
                <button type="button" class="btn btn-primary" id="balancer-save-btn">Сохранить</button>
            </div>
            <form id="balancer-form">
                ${allKeys
            .sort((a, b) => {
            const aIsBool = typeof data[a] === 'boolean';
            const bIsBool = typeof data[b] === 'boolean';
            if (aIsBool === bIsBool)
                return 0;
            return aIsBool ? 1 : -1;
        })
            .map((key) => {
            var _a, _b, _c, _d, _e;
            const defValue = balancerDefaults[key];
            const value = current[key];
            const customValue = custom[key];
            if (key === 'headers' || key === 'headers_stream') {
                // Не выводить, если пустой объект или undefined/null
                const obj = Object.assign({}, (customValue || value || defValue));
                const balancerKey = balancer; // для замыкания
                const modalId = 'online-modal';
                // Генерация строк для редактирования
                const rows = Object.entries(obj)
                    .map(([k, v], idx) => `
                                <div class="row mb-2 align-items-center" data-row>
                                    <div class="col-5">
                                        <input type="text" class="form-control form-control-sm" name="header-key" value="${k}" data-idx="${idx}">
                                    </div>
                                    <div class="col-5">
                                        <input type="text" class="form-control form-control-sm" name="header-value" value="${escapeHtmlAttr(typeof v === 'object' ? JSON.stringify(v) : v)}" data-idx="${idx}">
                                    </div>
                                    <div class="col-2 text-end">
                                        <button type="button" class="btn btn-danger btn-sm" data-remove-row>&times;</button>
                                    </div>
                                </div>
                            `).join('');
                // Добавляем модальное окно (один раз)
                if (!document.getElementById(modalId)) {
                    const modalHtml = `
                                <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="online-modal-label" aria-hidden="true">
                                  <div class="modal-dialog modal-xl">
                                    <div class="modal-content">
                                      <div class="modal-header">
                                        <h5 class="modal-title" id="online-modal-label">Редактировать ${key}</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                                      </div>
                                      <div class="modal-body" id="online-modal-body"></div>
                                      <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Закрыть</button>
                                        <button type="button" class="btn btn-primary" id="modal-save-btn">Сохранить</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            `;
                    document.body.insertAdjacentHTML('beforeend', modalHtml);
                }
                // Кнопка для показа модального окна
                setTimeout(() => {
                    const btn = document.getElementById(`show-modal-${key}`);
                    if (btn) {
                        btn.onclick = function () {
                            const modalBody = document.getElementById('online-modal-body');
                            if (modalBody) {
                                modalBody.innerHTML = `
                                                <form id="modal-headers-form">
                                                    <div id="modal-headers-rows">
                                                        ${rows}
                                                    </div>
                                                    <button type="button" class="btn btn-success btn-sm mt-2" id="add-header-row">Добавить</button>
                                                </form>
                                            `;
                                // Добавить новую строку
                                const addBtn = document.getElementById('add-header-row');
                                if (addBtn) {
                                    addBtn.onclick = function () {
                                        const rowsDiv = document.getElementById('modal-headers-rows');
                                        if (rowsDiv) {
                                            rowsDiv.insertAdjacentHTML('beforeend', `
                                                        <div class="row mb-2 align-items-center" data-row>
                                                            <div class="col-5">
                                                                <input type="text" class="form-control form-control-sm" name="header-key" value="">
                                                            </div>
                                                            <div class="col-5">
                                                                <input type="text" class="form-control form-control-sm" name="header-value" value="">
                                                            </div>
                                                            <div class="col-2 text-end">
                                                                <button type="button" class="btn btn-danger btn-sm" data-remove-row>&times;</button>
                                                            </div>
                                                        </div>
                                                    `);
                                        }
                                    };
                                }
                                // Удаление строки
                                modalBody.addEventListener('click', function (e) {
                                    const target = e.target;
                                    if (target && target.hasAttribute('data-remove-row')) {
                                        const row = target.closest('[data-row]');
                                        if (row)
                                            row.remove();
                                    }
                                });
                                // Сохранение
                                const saveBtn = document.getElementById('modal-save-btn');
                                if (saveBtn) {
                                    saveBtn.onclick = function () {
                                        const form = document.getElementById('modal-headers-form');
                                        if (!form)
                                            return;
                                        const keys = Array.from(form.querySelectorAll('input[name="header-key"]'));
                                        const values = Array.from(form.querySelectorAll('input[name="header-value"]'));
                                        const newObj = {};
                                        for (let i = 0; i < keys.length; i++) {
                                            const k = keys[i].value.trim();
                                            let v = values[i].value;
                                            if (!k)
                                                continue;
                                            // Попытка распарсить JSON, иначе строка
                                            try {
                                                v = JSON.parse(v);
                                            }
                                            catch ( /* оставить строкой */_a) { /* оставить строкой */ }
                                            newObj[k] = v;
                                        }
                                        // Обновляем rootCustomtItems
                                        if (!rootCustomtItems)
                                            rootCustomtItems = {};
                                        if (!rootCustomtItems[balancerKey])
                                            rootCustomtItems[balancerKey] = {};
                                        rootCustomtItems[balancerKey][key] = newObj;
                                        // Закрыть модалку
                                        // @ts-ignore
                                        const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
                                        if (modal)
                                            modal.hide();
                                        // Перерисовать форму
                                        renderBalancerForm(balancerKey);
                                        // Автоматически нажимаем на кнопку "Сохранить" основной формы
                                        const balancerSaveBtn = document.getElementById('balancer-save-btn');
                                        if (balancerSaveBtn) {
                                            balancerSaveBtn.click();
                                        }
                                    };
                                }
                            }
                            // Открываем модальное окно через Bootstrap API
                            // @ts-ignore
                            const modal = new bootstrap.Modal(document.getElementById(modalId));
                            modal.show();
                        };
                    }
                }, 0);
                return `
                            <div class="mb-2">
                                <b id="show-modal-${key}" style="cursor:pointer; color:#0d6efd;">${key}</b>
                            </div>
                            <div class="mb-3" style="font-family:monospace; background:#f8f9fa; border-radius:4px; padding:8px;">
                                ${renderObjectAsText(obj)}
                            </div>
                        `;
            }
            else if (key === 'vast') {
                return `
                                <div class="mb-2"><b>vast</b></div>
                                <div class="mb-3 ms-3">
                                    <label class="form-label">url</label>
                                    <input type="text" class="form-control" name="vast.url" value="${(customValue && customValue.url) ? customValue.url : ''}" placeholder="${(_a = (value && value.url)) !== null && _a !== void 0 ? _a : ''}">
                                </div>
                                <div class="mb-3 ms-3">
                                    <label class="form-label">msg</label>
                                    <input type="text" class="form-control" name="vast.msg" value="${(customValue && customValue.msg) ? customValue.msg : ''}" placeholder="${(_b = (value && value.msg)) !== null && _b !== void 0 ? _b : ''}">
                                </div>
                            `;
            }
            else if (typeof ((_c = customValue !== null && customValue !== void 0 ? customValue : value) !== null && _c !== void 0 ? _c : defValue) === 'object' && !Array.isArray((_d = customValue !== null && customValue !== void 0 ? customValue : value) !== null && _d !== void 0 ? _d : defValue))
                return '';
            else if (Array.isArray((_e = customValue !== null && customValue !== void 0 ? customValue : value) !== null && _e !== void 0 ? _e : defValue)) {
                const commaLabel = arrayCommaKeys.includes(key) ? ' <span class="text-muted">- через запятую</span>' : '';
                return `
                                <div class="mb-3">
                                    <label class="form-label">${key}${commaLabel}</label>
                                    <input type="text" class="form-control" name="${key}" value="${Array.isArray(customValue) ? customValue.join(', ') : ''}" placeholder="${Array.isArray(value) ? value.join(', ') : ''}">
                                </div>
                            `;
            }
            else if (typeof value === 'boolean') {
                // Для boolean: если customValue определён, используем его, иначе value
                const checked = (typeof customValue === 'boolean' ? customValue : value) ? 'checked' : '';
                const notDefault = (typeof customValue === 'boolean') ? ' <span class="text-warning">(not default)</span>' : '';
                return `
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" name="${key}" id="balancer-${key}" ${checked}>
                                <label class="form-check-label" for="balancer-${key}">${key}${notDefault}</label>
                            </div>
                        `;
            }
            return `
                            <div class="mb-3">
                                <label class="form-label">${key}</label>
                                <input type="text" class="form-control" name="${key}" value="${customValue !== undefined && customValue !== null ? customValue : ''}" placeholder="${value !== undefined && value !== null ? value : ''}">
                            </div>
                        `;
        }).join('')}
            <button type="button" class="btn btn-primary mt-4" id="balancer-save-btn2">Сохранить</button></form>
        `;
        const saveBtn2 = document.getElementById('balancer-save-btn2');
        if (saveBtn2) {
            saveBtn2.onclick = function () {
                const saveBtn = document.getElementById('balancer-save-btn');
                if (saveBtn) {
                    saveBtn.click();
                }
            };
        }
        // Обработчик кнопки "Сохранить"
        const saveBtn = document.getElementById('balancer-save-btn');
        if (saveBtn) {
            saveBtn.onclick = function () {
                const form = document.getElementById('balancer-form');
                if (!form)
                    return;
                // Собираем значения из формы
                const formData = new FormData(form);
                const updated = {};
                allKeys.forEach(key => {
                    var _a;
                    if (ignoreSaveKeys.includes(key))
                        return;
                    // vast
                    if (key === 'vast') {
                        updated.vast = {
                            url: formData.get('vast.url') || "",
                            msg: formData.get('vast.msg') || ""
                        };
                        return;
                    }
                    // boolean
                    if (typeof current[key] === 'boolean') {
                        updated[key] = formData.get(key) === 'on';
                        return;
                    }
                    // int (сохраняем как число, если в rootDefaultItems тип number и целое)
                    if (typeof current[key] === 'number' &&
                        Number.isInteger(current[key])) {
                        const val = formData.get(key);
                        updated[key] = val !== null && val !== undefined && val !== ""
                            ? parseInt(val, 10)
                            : 0;
                        return;
                    }
                    // массивы
                    if (Array.isArray(defaultBalancer[key]) || Array.isArray(current[key])) {
                        const val = formData.get(key) || "";
                        updated[key] = val.split(',').map(s => s.trim()).filter(Boolean);
                        return;
                    }
                    // обычные поля
                    updated[key] = (_a = formData.get(key)) !== null && _a !== void 0 ? _a : "";
                });
                // Обновляем rootCustomtItems
                if (!rootCustomtItems)
                    rootCustomtItems = {};
                rootCustomtItems[balancer] = Object.assign(Object.assign({}, rootCustomtItems[balancer]), updated);
                // Удаляем из rootCustomtItems[balancer] пустые поля и поля, совпадающие с rootDefaultItems
                if (rootCustomtItems[balancer]) {
                    const curr = rootDefaultItems && rootDefaultItems[balancer] ? rootDefaultItems[balancer] : {};
                    Object.keys(rootCustomtItems[balancer]).forEach(key => {
                        const val = rootCustomtItems[balancer][key];
                        // Специальная проверка для vast: если vast.url пустой, удалить весь vast
                        if (key === "vast" &&
                            val &&
                            typeof val === "object" &&
                            ("url" in val) &&
                            (val.url === undefined || val.url === null || val.url === "")) {
                            delete rootCustomtItems[balancer][key];
                            return;
                        }
                        // Удаляем пустые строки, пустые массивы, пустые объекты
                        if (val === "" ||
                            (Array.isArray(val) && (val.length === 0 || (val.length === 1 && val[0] === ""))) ||
                            (typeof val === "object" && val !== null && !Array.isArray(val) && Object.keys(val).length === 0)) {
                            delete rootCustomtItems[balancer][key];
                            return;
                        }
                        // Удаляем если совпадает с rootDefaultItems
                        if (typeof val === "object" && val !== null && !Array.isArray(val) && curr[key] &&
                            JSON.stringify(val) === JSON.stringify(curr[key])) {
                            delete rootCustomtItems[balancer][key];
                            return;
                        }
                        if (Array.isArray(val) && Array.isArray(curr[key]) &&
                            JSON.stringify(val) === JSON.stringify(curr[key])) {
                            delete rootCustomtItems[balancer][key];
                            return;
                        }
                        if ((typeof val === "string" || typeof val === "number" || typeof val === "boolean") &&
                            val === curr[key]) {
                            delete rootCustomtItems[balancer][key];
                            return;
                        }
                    });
                    // Если после очистки не осталось полей — удаляем весь объект
                    if (Object.keys(rootCustomtItems[balancer]).length === 0) {
                        delete rootCustomtItems[balancer];
                    }
                }
                // Отправляем на сервер
                saveCustomtItems();
            };
        }
    }
    // Рендерим страницу после загрузки данных и формирования balancers
    loadCustomAndCurrent(container, () => {
        // Формируем HTML для бокового меню динамически
        const sidebarHtml = `
            <div class="list-group" id="balancer-sidebar">
                ${balancers.map((balancer, idx) => `
                    <a href="#" class="list-group-item list-group-item-action${idx === 0 ? ' active' : ''}" data-balancer="${balancer}">${balancer}</a>
                `).join('')}
            </div>
        `;
        // Добавляем кастомный стиль для активного пункта
        const styleId = 'online-balancer-active-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                #balancer-sidebar .list-group-item.active {
                    background: linear-gradient(90deg, #0d6efd 60%, #3a8bfd 100%);
                    color: #fff;
                    font-weight: bold;
                    border-color: #0d6efd;
                    box-shadow: 0 2px 8px rgba(13,110,253,0.10);
                }
                #balancer-sidebar .list-group-item.active:focus, 
                #balancer-sidebar .list-group-item.active:hover {
                    background: linear-gradient(90deg, #0b5ed7 60%, #2563eb 100%);
                    color: #fff;
                }
            `;
            document.head.appendChild(style);
        }
        container.innerHTML = `
            <div class="row">
                <div class="col-12 col-md-2 mb-3 mb-md-0">
                    ${sidebarHtml}
                </div>
                <div class="col-12 col-md-10" id="online-main-content" style="margin-bottom: 1.2em; background-color: #fdfdfd; padding: 10px; border-radius: 8px; box-shadow: 0 18px 24px rgb(175 175 175 / 30%);"></div>
            </div>
        `;
        // По умолчанию показываем первый balancer, если есть
        if (balancers.length > 0) {
            renderBalancerForm(balancers[0]);
        }
        // Навешиваем обработчик на меню после рендера
        setTimeout(() => {
            const sidebar = document.getElementById('balancer-sidebar');
            if (sidebar) {
                sidebar.querySelectorAll('a[data-balancer]').forEach(link => {
                    link.addEventListener('click', function (e) {
                        e.preventDefault();
                        // Снимаем активный класс со всех
                        sidebar.querySelectorAll('.list-group-item').forEach(item => item.classList.remove('active'));
                        // Добавляем активный класс текущему
                        e.currentTarget.classList.add('active');
                        const balancer = e.currentTarget.getAttribute('data-balancer');
                        if (!balancer)
                            return;
                        renderBalancerForm(balancer);
                    });
                });
            }
        }, 0);
    });
}
function loadCustomAndDefault(container, onLoaded) {
    let loaded = 0;
    let hasError = false;
    function checkLoaded() {
        loaded++;
        if (loaded === 2 && !hasError && onLoaded) {
            onLoaded();
        }
    }
    fetch('/admin/init/custom')
        .then(res => res.json())
        .then(data => {
        rootCustomtItems = data;
        checkLoaded();
    })
        .catch(() => {
        hasError = true;
        if (container) {
            container.innerHTML = `<div class="alert alert-danger">Ошибка загрузки customItems</div>`;
        }
    });
    checkLoaded();
}
function renderBaseForm() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
    const BASE_FIXED_VALUES = {
        "multiaccess": (_b = (_a = rootCustomtItems === null || rootCustomtItems === void 0 ? void 0 : rootCustomtItems.multiaccess) !== null && _a !== void 0 ? _a : rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.multiaccess) !== null && _b !== void 0 ? _b : false,
        "mikrotik": (_d = (_c = rootCustomtItems === null || rootCustomtItems === void 0 ? void 0 : rootCustomtItems.mikrotik) !== null && _c !== void 0 ? _c : rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.mikrotik) !== null && _d !== void 0 ? _d : false,
        "typecache": (_e = rootCustomtItems === null || rootCustomtItems === void 0 ? void 0 : rootCustomtItems.typecache) !== null && _e !== void 0 ? _e : "",
        "imagelibrary": (_f = rootCustomtItems === null || rootCustomtItems === void 0 ? void 0 : rootCustomtItems.imagelibrary) !== null && _f !== void 0 ? _f : "",
        "pirate_store": (_h = (_g = rootCustomtItems === null || rootCustomtItems === void 0 ? void 0 : rootCustomtItems.pirate_store) !== null && _g !== void 0 ? _g : rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.pirate_store) !== null && _h !== void 0 ? _h : true,
        "apikey": (_j = rootCustomtItems === null || rootCustomtItems === void 0 ? void 0 : rootCustomtItems.apikey) !== null && _j !== void 0 ? _j : "",
        "litejac": (_l = (_k = rootCustomtItems === null || rootCustomtItems === void 0 ? void 0 : rootCustomtItems.litejac) !== null && _k !== void 0 ? _k : rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.litejac) !== null && _l !== void 0 ? _l : true,
        "filelog": (_o = (_m = rootCustomtItems === null || rootCustomtItems === void 0 ? void 0 : rootCustomtItems.filelog) !== null && _m !== void 0 ? _m : rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.filelog) !== null && _o !== void 0 ? _o : false,
        "disableEng": (_q = (_p = rootCustomtItems === null || rootCustomtItems === void 0 ? void 0 : rootCustomtItems.disableEng) !== null && _p !== void 0 ? _p : rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.disableEng) !== null && _q !== void 0 ? _q : false,
        "anticaptchakey": (_r = rootCustomtItems === null || rootCustomtItems === void 0 ? void 0 : rootCustomtItems.anticaptchakey) !== null && _r !== void 0 ? _r : "",
        "omdbapi_key": (_s = rootCustomtItems === null || rootCustomtItems === void 0 ? void 0 : rootCustomtItems.omdbapi_key) !== null && _s !== void 0 ? _s : "",
        "playerInner": (_t = rootCustomtItems === null || rootCustomtItems === void 0 ? void 0 : rootCustomtItems.playerInner) !== null && _t !== void 0 ? _t : "",
        "defaultOn": (_u = rootCustomtItems === null || rootCustomtItems === void 0 ? void 0 : rootCustomtItems.defaultOn) !== null && _u !== void 0 ? _u : "enable",
        "real_ip_cf": (_w = (_v = rootCustomtItems === null || rootCustomtItems === void 0 ? void 0 : rootCustomtItems.real_ip_cf) !== null && _v !== void 0 ? _v : rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.real_ip_cf) !== null && _w !== void 0 ? _w : false,
        "corsehost": (_x = rootCustomtItems === null || rootCustomtItems === void 0 ? void 0 : rootCustomtItems.corsehost) !== null && _x !== void 0 ? _x : ""
    };
    const BASE_DEFAULT_VALUES = {
        "multiaccess": (_y = rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.multiaccess) !== null && _y !== void 0 ? _y : false,
        "mikrotik": (_z = rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.mikrotik) !== null && _z !== void 0 ? _z : false,
        "typecache": (_0 = rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.typecache) !== null && _0 !== void 0 ? _0 : "",
        "imagelibrary": (_1 = rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.imagelibrary) !== null && _1 !== void 0 ? _1 : "",
        "pirate_store": (_2 = rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.pirate_store) !== null && _2 !== void 0 ? _2 : true,
        "apikey": (_3 = rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.apikey) !== null && _3 !== void 0 ? _3 : "",
        "litejac": (_4 = rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.litejac) !== null && _4 !== void 0 ? _4 : true,
        "filelog": (_5 = rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.filelog) !== null && _5 !== void 0 ? _5 : false,
        "disableEng": (_6 = rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.disableEng) !== null && _6 !== void 0 ? _6 : false,
        "anticaptchakey": (_7 = rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.anticaptchakey) !== null && _7 !== void 0 ? _7 : "",
        "omdbapi_key": (_8 = rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.omdbapi_key) !== null && _8 !== void 0 ? _8 : "",
        "playerInner": (_9 = rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.playerInner) !== null && _9 !== void 0 ? _9 : "",
        "defaultOn": (_10 = rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.defaultOn) !== null && _10 !== void 0 ? _10 : "enable",
        "real_ip_cf": (_11 = rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.real_ip_cf) !== null && _11 !== void 0 ? _11 : false,
        "corsehost": (_12 = rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems.corsehost) !== null && _12 !== void 0 ? _12 : ""
    };
    let html = `<form id="base-form">`;
    Object.entries(BASE_FIXED_VALUES).forEach(([field, defValue]) => {
        var _a;
        const defType = typeof defValue;
        let value = defValue;
        let placeholder = (_a = BASE_DEFAULT_VALUES[field]) !== null && _a !== void 0 ? _a : '';
        if (defType === 'boolean') {
            html += `
                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="field-base-${field}" name="base.${field}" ${value ? 'checked' : ''}>
                    <label class="form-check-label" for="field-base-${field}">${field}</label>
                </div>
            `;
        }
        else if (defType === 'number') {
            html += `
                <div class="mb-3">
                    <label class="form-label" for="field-base-${field}">${field}</label>
                    <input type="number" class="form-control" id="field-base-${field}" name="base.${field}" value="${value}" placeholder="${placeholder}">
                </div>
            `;
        }
        else {
            html += `
                <div class="mb-3">
                    <label class="form-label" for="field-base-${field}">${field}</label>
                    <input type="text" class="form-control" id="field-base-${field}" name="base.${field}" value="${value}" placeholder="${placeholder}">
                </div>
            `;
        }
    });
    html += `<button type="button" class="btn btn-primary" id="base-save-btn">Сохранить</button></form>`;
    const mainContent = document.getElementById('other-main-content');
    if (mainContent)
        mainContent.innerHTML = html;
    const saveBtn = document.getElementById('base-save-btn');
    if (saveBtn) {
        saveBtn.onclick = function () {
            const form = document.getElementById('base-form');
            if (!form)
                return;
            const formData = new FormData(form);
            const updated = {};
            Object.entries(BASE_FIXED_VALUES).forEach(([field, defValue]) => {
                const defType = typeof defValue;
                let val = formData.get(`base.${field}`);
                if (defType === 'boolean') {
                    const el = form.querySelector(`[name="base.${field}"]`);
                    val = el ? el.checked : false;
                }
                else if (defType === 'number') {
                    val = val !== null && val !== undefined && val !== '' ? parseInt(val, 10) : defValue;
                }
                else {
                    val = val !== null && val !== void 0 ? val : '';
                }
                // Удаляем пустые значения и значения, совпадающие с rootDefaultItems
                const defaultVal = rootDefaultItems === null || rootDefaultItems === void 0 ? void 0 : rootDefaultItems[field];
                const isEmpty = (defType === 'string' && val === '') ||
                    (defType === 'number' && (val === '' || isNaN(val)));
                const isDefault = defaultVal !== undefined && val === defaultVal;
                if (!isEmpty && !isDefault) {
                    updated[field] = val;
                }
            });
            // Обновляем rootCustomtItems без вложенности "base"
            // Удаляем старые base-поля
            Object.keys(BASE_FIXED_VALUES).forEach(field => {
                if (field in rootCustomtItems) {
                    delete rootCustomtItems[field];
                }
            });
            // Добавляем новые значения
            rootCustomtItems = Object.assign(Object.assign({}, rootCustomtItems), updated);
            saveCustomtItems();
        };
    }
}
function renderOnterModalContext(html, custom, def) {
    var _a, _b, _c, _d, _e, _f, _g;
    html += `
        <button type="button" class="btn btn-secondary mb-2 mt-3" id="context-modal-btn">context</button>
        <div class="modal" tabindex="-1" id="context-modal" style="display:none; background:rgba(0,0,0,0.3); position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1050;">
            <div class="modal-dialog" style="margin:10vh auto; max-width:400px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Редактировать context</h5>
                        <button type="button" class="btn-close" id="context-modal-close" aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">
                        <form id="context-form">
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="context-keepopen" name="keepopen" ${((_a = custom.keepopen) !== null && _a !== void 0 ? _a : def.keepopen) ? 'checked' : ''}>
                                <label class="form-check-label" for="context-keepopen">keepopen</label>
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="context-keepalive">keepalive</label>
                                <input type="number" class="form-control" id="context-keepalive" name="keepalive" value="${(_b = custom.keepalive) !== null && _b !== void 0 ? _b : ''}" placeholder="${(_c = def.keepalive) !== null && _c !== void 0 ? _c : ''}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="context-min">min</label>
                                <input type="number" class="form-control" id="context-min" name="min" value="${(_d = custom.min) !== null && _d !== void 0 ? _d : ''}" placeholder="${(_e = def.min) !== null && _e !== void 0 ? _e : ''}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="context-max">max</label>
                                <input type="number" class="form-control" id="context-max" name="max" value="${(_f = custom.max) !== null && _f !== void 0 ? _f : ''}" placeholder="${(_g = def.max) !== null && _g !== void 0 ? _g : ''}">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="context-modal-cancel">Отмена</button>
                        <button type="button" class="btn btn-primary" id="context-modal-save">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    return html;
}
function initOnterModalContext(key, def) {
    var modal = document.getElementById('context-modal');
    var openBtn = document.getElementById('context-modal-btn');
    var closeBtn = document.getElementById('context-modal-close');
    var cancelBtn = document.getElementById('context-modal-cancel');
    var saveBtn = document.getElementById('context-modal-save');
    var closeModal = function () {
        if (modal)
            modal.style.display = 'none';
    };
    var openModal = function () {
        if (modal)
            modal.style.display = 'block';
    };
    if (openBtn)
        openBtn.onclick = openModal;
    if (closeBtn)
        closeBtn.onclick = closeModal;
    if (cancelBtn)
        cancelBtn.onclick = closeModal;
    if (saveBtn) {
        saveBtn.onclick = function () {
            var form = document.getElementById('context-form');
            if (!form)
                return;
            var formData = new FormData(form);
            var updatedContext = {
                keepopen: (formData.get('keepopen') === 'on'),
                keepalive: parseInt(formData.get('keepalive'), 10) || 0,
                min: parseInt(formData.get('min'), 10) || 0,
                max: parseInt(formData.get('max'), 10) || 0
            };
            // Удаляем переменные с 0 или совпадающие с дефолтными
            Object.keys(updatedContext).forEach(function (key) {
                if (updatedContext[key] === 0 ||
                    (def && def[key] !== undefined && updatedContext[key] === def[key])) {
                    delete updatedContext[key];
                }
            });
            if (key === 'chromium') {
                rootCustomtItems = Object.assign(Object.assign({}, rootCustomtItems), { chromium: Object.assign(Object.assign({}, (rootCustomtItems.chromium || {})), { context: updatedContext }) });
            }
            else {
                rootCustomtItems = Object.assign(Object.assign({}, rootCustomtItems), { firefox: Object.assign(Object.assign({}, (rootCustomtItems.firefox || {})), { context: updatedContext }) });
            }
            closeModal();
            saveCustomtItems();
        };
    }
}
function renderOnterModalImage(html, custom, def) {
    var _a, _b, _c, _d, _e, _f;
    html += `
        <button type="button" class="btn btn-secondary mb-2 mt-3" id="image-modal-btn">image</button>
        <div class="modal" tabindex="-1" id="image-modal" style="display:none; background:rgba(0,0,0,0.3); position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1050;">
            <div class="modal-dialog" style="margin:10vh auto; max-width:400px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Редактировать image</h5>
                        <button type="button" class="btn-close" id="image-modal-close" aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">
                        <form id="image-form">
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="image-cache" name="cache" ${((_a = custom.cache) !== null && _a !== void 0 ? _a : def.cache) ? 'checked' : ''}>
                                <label class="form-check-label" for="image-cache">cache</label>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="image-cache_rsize" name="cache_rsize" ${((_b = custom.cache_rsize) !== null && _b !== void 0 ? _b : def.cache_rsize) ? 'checked' : ''}>
                                <label class="form-check-label" for="image-cache_rsize">cache_rsize</label>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="image-useproxy" name="useproxy" ${((_c = custom.useproxy) !== null && _c !== void 0 ? _c : def.useproxy) ? 'checked' : ''}>
                                <label class="form-check-label" for="image-useproxy">useproxy</label>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="image-useproxystream" name="useproxystream" ${((_d = custom.useproxystream) !== null && _d !== void 0 ? _d : def.useproxystream) ? 'checked' : ''}>
                                <label class="form-check-label" for="image-useproxystream">useproxystream</label>
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="image-globalnameproxy">globalnameproxy</label>
                                <input type="text" class="form-control" id="image-globalnameproxy" name="globalnameproxy" value="${(_e = custom.globalnameproxy) !== null && _e !== void 0 ? _e : ''}" placeholder="${(_f = def.globalnameproxy) !== null && _f !== void 0 ? _f : ''}">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="image-modal-cancel">Отмена</button>
                        <button type="button" class="btn btn-primary" id="image-modal-save">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    return html;
}
function initOnterModalImage(key, def) {
    var modal = document.getElementById('image-modal');
    var openBtn = document.getElementById('image-modal-btn');
    var closeBtn = document.getElementById('image-modal-close');
    var cancelBtn = document.getElementById('image-modal-cancel');
    var saveBtn = document.getElementById('image-modal-save');
    var closeModal = function () {
        if (modal)
            modal.style.display = 'none';
    };
    var openModal = function () {
        if (modal)
            modal.style.display = 'block';
    };
    if (openBtn)
        openBtn.onclick = openModal;
    if (closeBtn)
        closeBtn.onclick = closeModal;
    if (cancelBtn)
        cancelBtn.onclick = closeModal;
    if (saveBtn) {
        saveBtn.onclick = function () {
            var _a;
            var form = document.getElementById('image-form');
            if (!form)
                return;
            var formData = new FormData(form);
            var updatedImage = {
                cache: (formData.get('cache') === 'on'),
                cache_rsize: (formData.get('cache_rsize') === 'on'),
                useproxy: (formData.get('useproxy') === 'on'),
                useproxystream: (formData.get('useproxystream') === 'on'),
                globalnameproxy: (_a = formData.get('globalnameproxy')) !== null && _a !== void 0 ? _a : ''
            };
            // Удаляем переменные, совпадающие с дефолтными
            Object.keys(updatedImage).forEach(function (field) {
                if ((def && def[field] !== undefined && updatedImage[field] === def[field]) ||
                    (typeof updatedImage[field] === 'string' && updatedImage[field] === '')) {
                    delete updatedImage[field];
                }
            });
            rootCustomtItems = Object.assign(Object.assign({}, rootCustomtItems), { [key]: Object.assign(Object.assign({}, (rootCustomtItems[key] || {})), { image: updatedImage }) });
            closeModal();
            saveCustomtItems();
        };
    }
}
function renderOnterModalBuffering(html, custom, def) {
    var _a, _b, _c, _d, _e, _f, _g;
    html += `
        <button type="button" class="btn btn-secondary mb-2 mt-3" id="buffering-modal-btn">buffering</button>
        <div class="modal" tabindex="-1" id="buffering-modal" style="display:none; background:rgba(0,0,0,0.3); position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1050;">
            <div class="modal-dialog" style="margin:10vh auto; max-width:400px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Редактировать buffering</h5>
                        <button type="button" class="btn-close" id="buffering-modal-close" aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">
                        <form id="buffering-form">
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="buffering-enable" name="enable" ${((_a = custom.enable) !== null && _a !== void 0 ? _a : def.enable) ? 'checked' : ''}>
                                <label class="form-check-label" for="buffering-enable">enable</label>
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="buffering-rent">rent</label>
                                <input type="number" class="form-control" id="buffering-rent" name="rent" value="${(_b = custom.rent) !== null && _b !== void 0 ? _b : ''}" placeholder="${(_c = def.rent) !== null && _c !== void 0 ? _c : ''}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="buffering-length">length</label>
                                <input type="number" class="form-control" id="buffering-length" name="length" value="${(_d = custom.length) !== null && _d !== void 0 ? _d : ''}" placeholder="${(_e = def.length) !== null && _e !== void 0 ? _e : ''}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="buffering-millisecondsTimeout">millisecondsTimeout</label>
                                <input type="number" class="form-control" id="buffering-millisecondsTimeout" name="millisecondsTimeout" value="${(_f = custom.millisecondsTimeout) !== null && _f !== void 0 ? _f : ''}" placeholder="${(_g = def.millisecondsTimeout) !== null && _g !== void 0 ? _g : ''}">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="buffering-modal-cancel">Отмена</button>
                        <button type="button" class="btn btn-primary" id="buffering-modal-save">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    return html;
}
function initOnterModalBuffering(key, def) {
    var modal = document.getElementById('buffering-modal');
    var openBtn = document.getElementById('buffering-modal-btn');
    var closeBtn = document.getElementById('buffering-modal-close');
    var cancelBtn = document.getElementById('buffering-modal-cancel');
    var saveBtn = document.getElementById('buffering-modal-save');
    var closeModal = function () {
        if (modal)
            modal.style.display = 'none';
    };
    var openModal = function () {
        if (modal)
            modal.style.display = 'block';
    };
    if (openBtn)
        openBtn.onclick = openModal;
    if (closeBtn)
        closeBtn.onclick = closeModal;
    if (cancelBtn)
        cancelBtn.onclick = closeModal;
    if (saveBtn) {
        saveBtn.onclick = function () {
            var form = document.getElementById('buffering-form');
            if (!form)
                return;
            var formData = new FormData(form);
            var updatedBuffering = {
                enable: (formData.get('enable') === 'on'),
                rent: parseInt(formData.get('rent'), 10) || 0,
                length: parseInt(formData.get('length'), 10) || 0,
                millisecondsTimeout: parseInt(formData.get('millisecondsTimeout'), 10) || 0
            };
            // Удаляем переменные с 0 или совпадающие с дефолтными
            Object.keys(updatedBuffering).forEach(function (field) {
                if (updatedBuffering[field] === 0 ||
                    (def && def[field] !== undefined && updatedBuffering[field] === def[field])) {
                    delete updatedBuffering[field];
                }
            });
            rootCustomtItems = Object.assign(Object.assign({}, rootCustomtItems), { [key]: Object.assign(Object.assign({}, (rootCustomtItems[key] || {})), { buffering: updatedBuffering }) });
            closeModal();
            saveCustomtItems();
        };
    }
}
function renderOnterModalDlna(html, custom, def) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    html += `
        <button type="button" class="btn btn-secondary mb-2 mt-3" id="dlna-modal-btn">cover</button>
        <div class="modal" tabindex="-1" id="dlna-modal" style="display:none; background:rgba(0,0,0,0.3); position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1050;">
            <div class="modal-dialog" style="margin:10vh auto; max-width:400px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Редактировать cover</h5>
                        <button type="button" class="btn-close" id="dlna-modal-close" aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">
                        <form id="dlna-form">
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="dlna-enable" name="enable" ${((_a = custom.enable) !== null && _a !== void 0 ? _a : def.enable) ? 'checked' : ''}>
                                <label class="form-check-label" for="dlna-enable">enable</label>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="dlna-consoleLog" name="consoleLog" ${((_b = custom.consoleLog) !== null && _b !== void 0 ? _b : def.consoleLog) ? 'checked' : ''}>
                                <label class="form-check-label" for="dlna-consoleLog">consoleLog</label>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="dlna-preview" name="preview" ${((_c = custom.preview) !== null && _c !== void 0 ? _c : def.preview) ? 'checked' : ''}>
                                <label class="form-check-label" for="dlna-preview">preview</label>
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="dlna-timeout">timeout</label>
                                <input type="number" class="form-control" id="dlna-timeout" name="timeout" value="${(_d = custom.timeout) !== null && _d !== void 0 ? _d : ''}" placeholder="${(_e = def.timeout) !== null && _e !== void 0 ? _e : ''}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="dlna-skipModificationTime">skipModificationTime</label>
                                <input type="number" class="form-control" id="dlna-skipModificationTime" name="skipModificationTime" value="${(_f = custom.skipModificationTime) !== null && _f !== void 0 ? _f : ''}" placeholder="${(_g = def.skipModificationTime) !== null && _g !== void 0 ? _g : ''}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="dlna-extension">extension</label>
                                <input type="text" class="form-control" id="dlna-extension" name="extension" value="${escapeHtmlAttr((_h = custom.extension) !== null && _h !== void 0 ? _h : '')}" placeholder="${escapeHtmlAttr((_j = def.extension) !== null && _j !== void 0 ? _j : '')}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="dlna-coverComand">coverComand</label>
                                <input type="text" class="form-control" id="dlna-coverComand" name="coverComand" value="${escapeHtmlAttr((_k = custom.coverComand) !== null && _k !== void 0 ? _k : '')}" placeholder="${escapeHtmlAttr((_l = def.coverComand) !== null && _l !== void 0 ? _l : '')}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="dlna-previewComand">previewComand</label>
                                <input type="text" class="form-control" id="dlna-previewComand" name="previewComand" value="${escapeHtmlAttr((_m = custom.previewComand) !== null && _m !== void 0 ? _m : '')}" placeholder="${escapeHtmlAttr((_o = def.previewComand) !== null && _o !== void 0 ? _o : '')}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="dlna-priorityClass">priorityClass</label>
                                <input type="number" class="form-control" id="dlna-priorityClass" name="priorityClass" value="${escapeHtmlAttr((_p = custom.priorityClass) !== null && _p !== void 0 ? _p : '')}" placeholder="${escapeHtmlAttr((_q = def.priorityClass) !== null && _q !== void 0 ? _q : '')}">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="dlna-modal-cancel">Отмена</button>
                        <button type="button" class="btn btn-primary" id="dlna-modal-save">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    return html;
}
function initOnterModalDlna(key, def) {
    var modal = document.getElementById('dlna-modal');
    var openBtn = document.getElementById('dlna-modal-btn');
    var closeBtn = document.getElementById('dlna-modal-close');
    var cancelBtn = document.getElementById('dlna-modal-cancel');
    var saveBtn = document.getElementById('dlna-modal-save');
    var closeModal = function () {
        if (modal)
            modal.style.display = 'none';
    };
    var openModal = function () {
        if (modal)
            modal.style.display = 'block';
    };
    if (openBtn)
        openBtn.onclick = openModal;
    if (closeBtn)
        closeBtn.onclick = closeModal;
    if (cancelBtn)
        cancelBtn.onclick = closeModal;
    if (saveBtn) {
        saveBtn.onclick = function () {
            var _a, _b, _c;
            var form = document.getElementById('dlna-form');
            if (!form)
                return;
            var formData = new FormData(form);
            var updatedDlna = {
                enable: (formData.get('enable') === 'on'),
                consoleLog: (formData.get('consoleLog') === 'on'),
                preview: (formData.get('preview') === 'on'),
                timeout: parseInt(formData.get('timeout'), 10) || 0,
                skipModificationTime: parseInt(formData.get('skipModificationTime'), 10) || 0,
                extension: (_a = formData.get('extension')) !== null && _a !== void 0 ? _a : '',
                coverComand: (_b = formData.get('coverComand')) !== null && _b !== void 0 ? _b : '',
                previewComand: (_c = formData.get('previewComand')) !== null && _c !== void 0 ? _c : '',
                priorityClass: parseInt(formData.get('priorityClass'), 10) || 0
            };
            // Удаляем переменные с 0 или пустые строки, либо совпадающие с дефолтными
            Object.keys(updatedDlna).forEach(function (field) {
                if ((typeof updatedDlna[field] === 'boolean' && def && def[field] !== undefined && updatedDlna[field] === def[field]) ||
                    (typeof updatedDlna[field] === 'number' && (updatedDlna[field] === 0 || (def && def[field] !== undefined && updatedDlna[field] === def[field]))) ||
                    (typeof updatedDlna[field] === 'string' && (updatedDlna[field] === '' || (def && def[field] !== undefined && updatedDlna[field] === def[field])))) {
                    delete updatedDlna[field];
                }
            });
            rootCustomtItems = Object.assign(Object.assign({}, rootCustomtItems), { [key]: Object.assign(Object.assign({}, (rootCustomtItems[key] || {})), { cover: updatedDlna }) });
            closeModal();
            saveCustomtItems();
        };
    }
}
function renderOnterModalInitPlugins(html, custom, def) {
    html += `
        <button type="button" class="btn btn-secondary mb-2 mt-3" id="initplugins-modal-btn">initPlugins</button>
        <div class="modal" tabindex="-1" id="initplugins-modal" style="display:none; background:rgba(0,0,0,0.3); position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1050;">
            <div class="modal-dialog" style="margin:10vh auto; max-width:400px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Редактировать initPlugins</h5>
                        <button type="button" class="btn-close" id="initplugins-modal-close" aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">
                        <form id="initplugins-form">
                            ${['dlna', 'tracks', 'tmdbProxy', 'online', 'sisi', 'timecode', 'torrserver', 'backup', 'sync'].map(field => {
        var _a;
        return `
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" id="initplugins-${field}" name="${field}" ${((_a = custom[field]) !== null && _a !== void 0 ? _a : def[field]) ? 'checked' : ''}>
                                    <label class="form-check-label" for="initplugins-${field}">${field}</label>
                                </div>
                            `;
    }).join('')}
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="initplugins-modal-cancel">Отмена</button>
                        <button type="button" class="btn btn-primary" id="initplugins-modal-save">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    return html;
}
function initOnterModalInitPlugins(key, def) {
    var modal = document.getElementById('initplugins-modal');
    var openBtn = document.getElementById('initplugins-modal-btn');
    var closeBtn = document.getElementById('initplugins-modal-close');
    var cancelBtn = document.getElementById('initplugins-modal-cancel');
    var saveBtn = document.getElementById('initplugins-modal-save');
    var closeModal = function () {
        if (modal)
            modal.style.display = 'none';
    };
    var openModal = function () {
        if (modal)
            modal.style.display = 'block';
    };
    if (openBtn)
        openBtn.onclick = openModal;
    if (closeBtn)
        closeBtn.onclick = closeModal;
    if (cancelBtn)
        cancelBtn.onclick = closeModal;
    if (saveBtn) {
        saveBtn.onclick = function () {
            var form = document.getElementById('initplugins-form');
            if (!form)
                return;
            var formData = new FormData(form);
            var fields = ['dlna', 'tracks', 'tmdbProxy', 'online', 'sisi', 'timecode', 'torrserver', 'backup', 'sync'];
            var updatedInitPlugins = {};
            fields.forEach(field => {
                const el = form.querySelector(`[name="${field}"]`);
                const checked = el ? el.checked : false;
                if (def && def[field] !== undefined && checked === def[field]) {
                    // Совпадает с дефолтным, не сохраняем
                    return;
                }
                updatedInitPlugins[field] = checked;
            });
            rootCustomtItems = Object.assign(Object.assign({}, rootCustomtItems), { [key]: Object.assign(Object.assign({}, (rootCustomtItems[key] || {})), { initPlugins: updatedInitPlugins }) });
            closeModal();
            saveCustomtItems();
        };
    }
}
function renderOnterModalBookmarks(html, custom, def) {
    var _a, _b;
    html += `
        <button type="button" class="btn btn-secondary mb-2 mt-3" id="bookmarks-modal-btn">bookmarks</button>
        <div class="modal" tabindex="-1" id="bookmarks-modal" style="display:none; background:rgba(0,0,0,0.3); position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1050;">
            <div class="modal-dialog" style="margin:10vh auto; max-width:400px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Редактировать bookmarks</h5>
                        <button type="button" class="btn-close" id="bookmarks-modal-close" aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">
                        <form id="bookmarks-form">
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="bookmarks-saveimage" name="saveimage" ${((_a = custom.saveimage) !== null && _a !== void 0 ? _a : def.saveimage) ? 'checked' : ''}>
                                <label class="form-check-label" for="bookmarks-saveimage">saveimage</label>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="bookmarks-savepreview" name="savepreview" ${((_b = custom.savepreview) !== null && _b !== void 0 ? _b : def.savepreview) ? 'checked' : ''}>
                                <label class="form-check-label" for="bookmarks-savepreview">savepreview</label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="bookmarks-modal-cancel">Отмена</button>
                        <button type="button" class="btn btn-primary" id="bookmarks-modal-save">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    return html;
}
function initOnterModalBookmarks(key, def) {
    var modal = document.getElementById('bookmarks-modal');
    var openBtn = document.getElementById('bookmarks-modal-btn');
    var closeBtn = document.getElementById('bookmarks-modal-close');
    var cancelBtn = document.getElementById('bookmarks-modal-cancel');
    var saveBtn = document.getElementById('bookmarks-modal-save');
    var closeModal = function () {
        if (modal)
            modal.style.display = 'none';
    };
    var openModal = function () {
        if (modal)
            modal.style.display = 'block';
    };
    if (openBtn)
        openBtn.onclick = openModal;
    if (closeBtn)
        closeBtn.onclick = closeModal;
    if (cancelBtn)
        cancelBtn.onclick = closeModal;
    if (saveBtn) {
        saveBtn.onclick = function () {
            var form = document.getElementById('bookmarks-form');
            if (!form)
                return;
            var formData = new FormData(form);
            var updatedBookmarks = {
                saveimage: (formData.get('saveimage') === 'on'),
                savepreview: (formData.get('savepreview') === 'on')
            };
            // Удаляем переменные, совпадающие с дефолтными
            Object.keys(updatedBookmarks).forEach(function (field) {
                if ((def && def[field] !== undefined && updatedBookmarks[field] === def[field])) {
                    delete updatedBookmarks[field];
                }
            });
            rootCustomtItems = Object.assign(Object.assign({}, rootCustomtItems), { [key]: Object.assign(Object.assign({}, (rootCustomtItems[key] || {})), { bookmarks: updatedBookmarks }) });
            closeModal();
            saveCustomtItems();
        };
    }
}
function renderOtherPage(containerId) {
    const container = document.getElementById(containerId);
    if (!container)
        return;
    const keys = ['base', 'listen', 'WAF', 'tmdb', 'cub', 'LampaWeb', 'dlna', 'online', 'sisi', 'chromium', 'firefox', 'serverproxy', 'weblog', 'openstat', 'posterApi', 'rch', 'storage', 'ffprobe', 'fileCacheInactive', 'vast', 'apn', 'kit', 'sync'];
    loadCustomAndDefault(container, () => {
        // Боковое меню
        const sidebarHtml = `
            <div class="list-group" id="other-sidebar">
                ${keys.map((key, idx) => `
                    <a href="#" class="list-group-item list-group-item-action${idx === 0 ? ' active' : ''}" data-key="${key}">${key}</a>
                `).join('')}
            </div>
        `;
        container.innerHTML = `
            <div class="row">
                <div class="col-12 col-md-2 mb-3 mb-md-0">
                    ${sidebarHtml}
                </div>
                <div class="col-12 col-md-10" id="other-main-content" style="margin-bottom: 2em; background-color: #fdfdfd; padding: 10px; border-radius: 8px; box-shadow: 0 18px 24px rgb(175 175 175 / 30%);"></div>
            </div>
        `;
        function renderKeyForm(key) {
            if (key === 'base') {
                renderBaseForm();
                return;
            }
            const def = rootDefaultItems && rootDefaultItems[key] ? rootDefaultItems[key] : {};
            const custom = rootCustomtItems && rootCustomtItems[key] ? rootCustomtItems[key] : {};
            const excludeFields = ['proxy', 'override_conf', 'appReplace', 'cache_hls', 'headersDeny', // в пизду
                'context', 'image', 'buffering', 'cover', 'initPlugins', 'bookmarks']; // адаптировано
            const arrayEmptyFields = ['Args', 'geo', 'with_search', 'rsize_disable', 'proxyimg_disable', 'ipsDeny', 'ipsAllow', 'countryDeny', 'countryAllow'];
            let html = `<form id="other-form">`;
            Object.keys(def)
                .filter(field => !excludeFields.includes(field))
                .forEach(field => {
                var _a;
                const placeholder = (_a = def[field]) !== null && _a !== void 0 ? _a : '';
                let value = custom[field] !== undefined ? custom[field] : '';
                if (value === null || value === undefined)
                    value = '';
                const defType = typeof def[field];
                if (arrayEmptyFields.includes(field)) {
                    // Массив, который должен быть [""] если пусто
                    let arrValue = Array.isArray(value) ? value : [];
                    if (arrValue.length === 0)
                        arrValue = [''];
                    html += `
                            <div class="mb-3">
                                <label class="form-label" for="field-${key}-${field}">${field} (через запятую)</label>
                                <input type="text" class="form-control" id="field-${key}-${field}" name="${key}.${field}" value="${arrValue.join(', ')}" placeholder="${Array.isArray(placeholder) ? placeholder.join(', ') : ''}">
                            </div>
                        `;
                }
                else if (defType === 'boolean') {
                    html += `
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="field-${key}-${field}" name="${key}.${field}" ${(value !== '' ? value : def[field]) ? 'checked' : ''}>
                                <label class="form-check-label" for="field-${key}-${field}">${field}</label>
                            </div>
                        `;
                }
                else if (defType === 'number' && Number.isInteger(def[field])) {
                    html += `
                            <div class="mb-3">
                                <label class="form-label" for="field-${key}-${field}">${field}</label>
                                <input type="number" class="form-control" id="field-${key}-${field}" name="${key}.${field}" value="${value}" placeholder="${placeholder}">
                            </div>
                        `;
                }
                else {
                    html += `
                            <div class="mb-3">
                                <label class="form-label" for="field-${key}-${field}">${field}</label>
                                <input type="text" class="form-control" id="field-${key}-${field}" name="${key}.${field}" value="${value}" placeholder="${placeholder}">
                            </div>
                        `;
                }
            });
            html += `<button type="button" class="btn btn-primary" id="other-save-btn">Сохранить</button></form>`;
            if (def) {
                if (def['context']) {
                    html = renderOnterModalContext(html, (custom && custom['context']) ? custom['context'] : {}, def['context']);
                }
                if (def['image']) {
                    html = renderOnterModalImage(html, (custom && custom['image']) ? custom['image'] : {}, def['image']);
                }
                if (def['buffering']) {
                    html = renderOnterModalBuffering(html, (custom && custom['buffering']) ? custom['buffering'] : {}, def['buffering']);
                }
                if (def['cover']) {
                    html = renderOnterModalDlna(html, (custom && custom['cover']) ? custom['cover'] : {}, def['cover']);
                }
                if (def['initPlugins']) {
                    html = renderOnterModalInitPlugins(html, (custom && custom['initPlugins']) ? custom['initPlugins'] : {}, def['initPlugins']);
                }
                if (def['bookmarks']) {
                    html = renderOnterModalBookmarks(html, (custom && custom['bookmarks']) ? custom['bookmarks'] : {}, def['bookmarks']);
                }
            }
            const mainContent = document.getElementById('other-main-content');
            if (mainContent)
                mainContent.innerHTML = html;
            if (def) {
                if (def['context']) {
                    initOnterModalContext(key, def['context']);
                }
                if (def['image']) {
                    initOnterModalImage(key, def['image']);
                }
                if (def['buffering']) {
                    initOnterModalBuffering(key, def['buffering']);
                }
                if (def['cover']) {
                    initOnterModalDlna(key, def['cover']);
                }
                if (def['initPlugins']) {
                    initOnterModalInitPlugins(key, def['initPlugins']);
                }
                if (def['bookmarks']) {
                    initOnterModalBookmarks(key, def['bookmarks']);
                }
            }
            const saveBtn = document.getElementById('other-save-btn');
            if (saveBtn) {
                saveBtn.onclick = function () {
                    const form = document.getElementById('other-form');
                    if (!form)
                        return;
                    const formData = new FormData(form);
                    const updated = {};
                    updated[key] = {};
                    Object.keys(def)
                        .filter(field => !excludeFields.includes(field))
                        .forEach(field => {
                        const defType = typeof def[field];
                        let val = formData.get(`${key}.${field}`);
                        if (arrayEmptyFields.includes(field)) {
                            const arr = val
                                .split(',')
                                .map(s => s.trim())
                                .filter(s => s !== '');
                            if (arr.length > 0) {
                                updated[key][field] = arr;
                            }
                            else {
                                delete updated[key][field];
                            }
                        }
                        else if (defType === 'boolean') {
                            const el = form.querySelector(`[name="${key}.${field}"]`);
                            val = el ? el.checked : false;
                            if (val !== def[field])
                                updated[key][field] = val;
                        }
                        else if (defType === 'number' && Number.isInteger(def[field])) {
                            val = val !== null && val !== undefined && val !== '' ? parseInt(val, 10) : 0;
                            if (val !== 0 && val !== def[field])
                                updated[key][field] = val;
                        }
                        else if (val !== null && val !== undefined && val !== '') {
                            updated[key][field] = val;
                        }
                    });
                    // Обновляем rootCustomtItems
                    rootCustomtItems = Object.assign(Object.assign({}, rootCustomtItems), updated);
                    // Удаляем [key], если он пустой
                    if (Object.keys(rootCustomtItems[key]).length === 0) {
                        delete rootCustomtItems[key];
                    }
                    saveCustomtItems();
                };
            }
        }
        // По умолчанию показываем первый ключ
        renderKeyForm(keys[0]);
        // Навешиваем обработчик на меню
        setTimeout(() => {
            const sidebar = document.getElementById('other-sidebar');
            if (sidebar) {
                sidebar.querySelectorAll('a[data-key]').forEach(link => {
                    link.addEventListener('click', function (e) {
                        e.preventDefault();
                        // Снимаем активный класс со всех
                        sidebar.querySelectorAll('.list-group-item').forEach(item => item.classList.remove('active'));
                        // Добавляем активный класс текущему
                        e.currentTarget.classList.add('active');
                        const key = e.currentTarget.getAttribute('data-key');
                        if (!key)
                            return;
                        renderKeyForm(key);
                    });
                });
            }
        }, 0);
    });
}
const proxyDefaults = {
    name: '',
    pattern: '',
    useAuth: false,
    BypassOnLocal: false,
    username: '',
    password: '',
    pattern_auth: '',
    maxRequestError: 2,
    file: '',
    url: '',
    list: [],
    refresh_uri: ''
};
function getProxyModalHtml(modalId, title, proxy, showDelete = false) {
    return `
    <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="${modalId}Label">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <form id="${modalId}-form">
              <div class="mb-3">
                <label for="${modalId}-proxy-name" class="form-label">Имя для доступа через - globalnameproxy</label>
                <input type="text" class="form-control" id="${modalId}-proxy-name" value="${proxy ? (proxy.name || '') : ''}" placeholder="tor" required>
              </div>
              <div class="mb-3">
                <label for="${modalId}-proxy-pattern" class="form-label">Использовать прокси с подходящим regex (не обязательно)</label>
                <input type="text" class="form-control" id="${modalId}-proxy-pattern" value="${escapeHtmlAttr(proxy ? (proxy.pattern || '') : '')}" placeholder="\\\\.onion">
              </div>
              <div class="mb-3 mt-5 d-flex align-items-center">
                <div class="form-check me-5">
                  <input class="form-check-input" type="checkbox" id="${modalId}-proxy-useAuth" ${proxy && proxy.useAuth ? 'checked' : ''}>
                  <label class="form-check-label" for="${modalId}-proxy-useAuth">Использовать авторизацию</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="${modalId}-proxy-BypassOnLocal" ${proxy && proxy.BypassOnLocal ? 'checked' : ''}>
                  <label class="form-check-label" for="${modalId}-proxy-BypassOnLocal">Игнорировать localhost</label>
                </div>
              </div>
              <div class="mb-3">
                <label for="${modalId}-proxy-username" class="form-label">username</label>
                <input type="text" class="form-control" id="${modalId}-proxy-username" value="${proxy ? (proxy.username || '') : ''}" placeholder="не обязательно">
              </div>
              <div class="mb-3">
                <label for="${modalId}-proxy-password" class="form-label">password</label>
                <input type="text" class="form-control" id="${modalId}-proxy-password" value="${proxy ? (proxy.password || '') : ''}" placeholder="не обязательно">
              </div>
              <div class="mb-3">
                <label for="${modalId}-proxy-pattern_auth" class="form-label">pattern_auth</label>
                <input type="text" class="form-control" id="${modalId}-proxy-pattern_auth" value="${escapeHtmlAttr(proxy ? (proxy.pattern_auth || '') : '')}" placeholder="^(?<sheme>[^/]+//)?(?<username>[^:/]+):(?<password>[^@]+)@(?<host>.*)">
              </div>
              <div class="mb-3 mt-5">
                <label for="${modalId}-proxy-list" class="form-label">Список (через запятую)</label>
                <input type="text" class="form-control" id="${modalId}-proxy-list" value="${proxy && Array.isArray(proxy.list) ? proxy.list.join(', ') : ''}" placeholder="socks5://127.0.0.1:9050, http://127.0.0.1:5481">
              </div>
              <div class="mb-3">
                <label for="${modalId}-proxy-file" class="form-label">Файл списком</label>
                <input type="text" class="form-control" id="${modalId}-proxy-file" value="${proxy ? (proxy.file || '') : ''}" placeholder="myproxy/pl.txt">
              </div>
              <div class="mb-3">
                <label for="${modalId}-proxy-url" class="form-label">URL на список</label>
                <input type="text" class="form-control" id="${modalId}-proxy-url" value="${proxy ? (proxy.url || '') : ''}" placeholder="https://asocks-list.org/userid.txt?type=res&country=UA">
              </div>
              <div class="mb-3">
                <label for="${modalId}-proxy-refresh_uri" class="form-label">Refresh URI</label>
                <input type="text" class="form-control" id="${modalId}-proxy-refresh_uri" value="${proxy ? (proxy.refresh_uri || '') : ''}" placeholder="http://example.com/refresh">
              </div>
              <div class="mb-3">
                <label for="${modalId}-proxy-maxRequestError" class="form-label">Количество ошибок подряд для смены прокси</label>
                <input type="number" class="form-control" id="${modalId}-proxy-maxRequestError" value="${proxy ? proxy.maxRequestError : 2}">
              </div>
            </form>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            ${showDelete ? `<button type="button" class="btn btn-danger" id="${modalId}-delete-btn">Удалить</button>` : '<span></span>'}
            <div>
              <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Закрыть</button>
              <button type="button" class="btn btn-primary" id="${modalId}-save-btn">Сохранить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
}
function renderProxiesPage(containerId) {
    const container = document.getElementById(containerId);
    if (!container)
        return;
    const addModalHtml = getProxyModalHtml('addProxyModal', 'Добавить прокси');
    container.innerHTML = `
        ${addModalHtml}
        <div id="edit-proxy-modal-container"></div>
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="mb-0">Прокси</h1>
            <div>
                <button type="button" class="btn btn-success" id="btn-add-proxy">Добавить прокси</button>
                <button type="button" class="btn btn-primary" id="btn-save-proxies" style="display: none;">Сохранить</button>
            </div>
        </div>
        <div id="proxies-list" class="row g-3"></div>
    `;
    loadAndRenderProxies('proxies-list');
    setTimeout(() => {
        const btnSave = document.getElementById('btn-save-proxies');
        if (btnSave) {
            btnSave.onclick = () => {
                if (rootCustomtItems) {
                    saveCustomtItems();
                }
                else {
                    alert('Данные не загружены');
                }
            };
        }
        const btnAdd = document.getElementById('btn-add-proxy');
        if (btnAdd) {
            btnAdd.onclick = () => {
                // @ts-ignore
                const modal = new bootstrap.Modal(document.getElementById('addProxyModal'));
                modal.show();
            };
        }
        const saveProxyBtn = document.getElementById('addProxyModal-save-btn');
        if (saveProxyBtn) {
            saveProxyBtn.onclick = () => {
                const name = document.getElementById('addProxyModal-proxy-name').value.trim();
                const pattern = document.getElementById('addProxyModal-proxy-pattern').value.trim();
                const useAuth = document.getElementById('addProxyModal-proxy-useAuth').checked;
                const BypassOnLocal = document.getElementById('addProxyModal-proxy-BypassOnLocal').checked;
                const username = document.getElementById('addProxyModal-proxy-username').value.trim();
                const password = document.getElementById('addProxyModal-proxy-password').value.trim();
                const pattern_auth = document.getElementById('addProxyModal-proxy-pattern_auth').value.trim();
                const maxRequestError = parseInt(document.getElementById('addProxyModal-proxy-maxRequestError').value, 10) || 0;
                const file = document.getElementById('addProxyModal-proxy-file').value.trim();
                const url = document.getElementById('addProxyModal-proxy-url').value.trim();
                const listRaw = document.getElementById('addProxyModal-proxy-list').value.trim();
                const refresh_uri = document.getElementById('addProxyModal-proxy-refresh_uri').value.trim();
                if (!name && !pattern) {
                    alert('Заполните обязательное поле "Имя" или "pattern"');
                    return;
                }
                const list = listRaw ? listRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
                const newProxy = {
                    name,
                    pattern,
                    useAuth,
                    BypassOnLocal,
                    username,
                    password,
                    pattern_auth,
                    maxRequestError,
                    file,
                    url,
                    list,
                    refresh_uri
                };
                // Удаление пустых и дефолтных значений из proxy
                Object.keys(proxyDefaults).forEach(key => {
                    const value = newProxy[key];
                    const def = proxyDefaults[key];
                    if (value === undefined ||
                        value === null ||
                        (typeof def === 'string' && (value === '' || value === def)) ||
                        (typeof def === 'number' && value === def) ||
                        (typeof def === 'boolean' && value === def) ||
                        (Array.isArray(def) && Array.isArray(value) && value.length === 0)) {
                        delete newProxy[key];
                    }
                });
                if (rootCustomtItems && rootCustomtItems["globalproxy"] && Array.isArray(rootCustomtItems["globalproxy"])) {
                    rootCustomtItems["globalproxy"].push(newProxy);
                    const proxiesList = document.getElementById('proxies-list');
                    if (proxiesList) {
                        proxiesList.innerHTML = renderProxies(rootCustomtItems["globalproxy"]);
                        attachEditProxyHandlers(rootCustomtItems["globalproxy"]);
                    }
                }
                // @ts-ignore
                const modal = bootstrap.Modal.getInstance(document.getElementById('addProxyModal'));
                if (modal)
                    modal.hide();
                const btnSave = document.getElementById('btn-save-proxies');
                if (btnSave) {
                    btnSave.click();
                }
            };
        }
        if (rootCustomtItems && rootCustomtItems["globalproxy"] && Array.isArray(rootCustomtItems["globalproxy"])) {
            attachEditProxyHandlers(rootCustomtItems["globalproxy"]);
        }
    }, 0);
}
function attachEditProxyHandlers(proxies) {
    proxies.forEach((proxy, idx) => {
        const btn = document.getElementById(`edit-proxy-btn-${idx}`);
        if (btn) {
            btn.onclick = () => {
                const editModalId = `editProxyModal-${idx}`;
                const editModalHtml = getProxyModalHtml(editModalId, 'Редактировать прокси', proxy, true);
                const editModalContainer = document.getElementById('edit-proxy-modal-container');
                if (editModalContainer) {
                    editModalContainer.innerHTML = editModalHtml;
                }
                // @ts-ignore
                const modal = new bootstrap.Modal(document.getElementById(editModalId));
                modal.show();
                setTimeout(() => {
                    const saveBtn = document.getElementById(`${editModalId}-save-btn`);
                    if (saveBtn) {
                        saveBtn.onclick = () => {
                            const name = document.getElementById(`${editModalId}-proxy-name`).value.trim();
                            const pattern = document.getElementById(`${editModalId}-proxy-pattern`).value.trim();
                            const useAuth = document.getElementById(`${editModalId}-proxy-useAuth`).checked;
                            const BypassOnLocal = document.getElementById(`${editModalId}-proxy-BypassOnLocal`).checked;
                            const username = document.getElementById(`${editModalId}-proxy-username`).value.trim();
                            const password = document.getElementById(`${editModalId}-proxy-password`).value.trim();
                            const pattern_auth = document.getElementById(`${editModalId}-proxy-pattern_auth`).value.trim();
                            const maxRequestError = parseInt(document.getElementById(`${editModalId}-proxy-maxRequestError`).value, 10) || 0;
                            const file = document.getElementById(`${editModalId}-proxy-file`).value.trim();
                            const url = document.getElementById(`${editModalId}-proxy-url`).value.trim();
                            const listRaw = document.getElementById(`${editModalId}-proxy-list`).value.trim();
                            const refresh_uri = document.getElementById(`${editModalId}-proxy-refresh_uri`).value.trim();
                            if (!name && !pattern) {
                                alert('Заполните обязательное поле "Имя" или "pattern"');
                                return;
                            }
                            const list = listRaw ? listRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
                            proxy.name = name;
                            proxy.pattern = pattern;
                            proxy.useAuth = useAuth;
                            proxy.BypassOnLocal = BypassOnLocal;
                            proxy.username = username;
                            proxy.password = password;
                            proxy.pattern_auth = pattern_auth;
                            proxy.maxRequestError = maxRequestError;
                            proxy.file = file;
                            proxy.url = url;
                            proxy.list = list;
                            proxy.refresh_uri = refresh_uri;
                            // Удаление пустых и дефолтных значений из proxy
                            Object.keys(proxyDefaults).forEach(key => {
                                const value = proxy[key];
                                const def = proxyDefaults[key];
                                if (value === undefined ||
                                    value === null ||
                                    (typeof def === 'string' && (value === '' || value === def)) ||
                                    (typeof def === 'number' && value === def) ||
                                    (typeof def === 'boolean' && value === def) ||
                                    (Array.isArray(def) && Array.isArray(value) && value.length === 0)) {
                                    delete proxy[key];
                                }
                            });
                            const proxiesList = document.getElementById('proxies-list');
                            if (proxiesList) {
                                proxiesList.innerHTML = renderProxies(rootCustomtItems["globalproxy"]);
                                attachEditProxyHandlers(rootCustomtItems["globalproxy"]);
                            }
                            // @ts-ignore
                            const modal = bootstrap.Modal.getInstance(document.getElementById(editModalId));
                            if (modal)
                                modal.hide();
                            const btnSave = document.getElementById('btn-save-proxies');
                            if (btnSave) {
                                btnSave.click();
                            }
                        };
                    }
                    const deleteBtn = document.getElementById(`${editModalId}-delete-btn`);
                    if (deleteBtn) {
                        deleteBtn.onclick = () => {
                            if (confirm('Удалить прокси?')) {
                                if (rootCustomtItems && rootCustomtItems["globalproxy"] && Array.isArray(rootCustomtItems["globalproxy"])) {
                                    const proxiesArr = rootCustomtItems["globalproxy"];
                                    const proxyIdx = proxiesArr.indexOf(proxy);
                                    if (proxyIdx !== -1) {
                                        proxiesArr.splice(proxyIdx, 1);
                                        const proxiesList = document.getElementById('proxies-list');
                                        if (proxiesList) {
                                            proxiesList.innerHTML = renderProxies(proxiesArr);
                                            attachEditProxyHandlers(proxiesArr);
                                        }
                                        // @ts-ignore
                                        const modal = bootstrap.Modal.getInstance(document.getElementById(editModalId));
                                        if (modal)
                                            modal.hide();
                                        const btnSave = document.getElementById('btn-save-proxies');
                                        if (btnSave) {
                                            btnSave.click();
                                        }
                                    }
                                }
                            }
                        };
                    }
                }, 0);
            };
        }
    });
}
function loadAndRenderProxies(containerId) {
    const container = document.getElementById(containerId);
    if (!container)
        return;
    fetch('/admin/init/custom')
        .then(res => res.json())
        .then(ob => {
        rootCustomtItems = ob;
        return fetch('/admin/init/current');
    })
        .then(res => res.json())
        .then(ob => {
        if (!rootCustomtItems.globalproxy)
            rootCustomtItems.globalproxy = [];
        rootCustomtItems.globalproxy = Array.isArray(ob.globalproxy) ? ob.globalproxy : [];
        container.innerHTML = renderProxies(rootCustomtItems.globalproxy);
        setTimeout(() => {
            if (rootCustomtItems && rootCustomtItems.globalproxy && Array.isArray(rootCustomtItems.globalproxy)) {
                attachEditProxyHandlers(rootCustomtItems.globalproxy);
            }
        }, 0);
    })
        .catch(() => {
        container.innerHTML = '<div class="alert alert-danger">Ошибка загрузки прокси</div>';
    });
}
function renderProxies(proxies) {
    return `
        <table class="table table-bordered table-striped align-middle">
            <thead>
                <tr>
                    <th style="width:48px; text-align:center;"></th>
                    <th>Имя</th>
                    <th>Pattern</th>
                    <th>auth</th>
                    <th>list</th>
                    <th>url</th>
                    <th>file</th>
                    <th>refresh_uri</th>
                </tr>
            </thead>
            <tbody>
                ${proxies.map((proxy, idx) => {
        return `
                        <tr>
                            <td style="width:48px; text-align:center;">
                                <button type="button" class="btn btn-sm btn-light p-1" id="edit-proxy-btn-${idx}" title="Редактировать" style="width:32px; height:32px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
                                      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                                      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                                    </svg>
                                </button>
                            </td>
                            <td>${proxy.name || ''}</td>
                            <td>${escapeHtmlAttr(proxy.pattern || '')}</td>
                            <td>${proxy.useAuth ? 'Да' : 'Нет'}</td>
                            <td>${Array.isArray(proxy.list) ? proxy.list.join('<br>') : ''}</td>
                            <td>${proxy.url || ''}</td>
                            <td>${proxy.file || ''}</td>
                            <td>${proxy.refresh_uri || ''}</td>
                        </tr>
                    `;
    }).join('')}
            </tbody>
        </table>
    `;
}
function renderEditorPage(containerId) {
    const container = document.getElementById(containerId);
    if (!container)
        return;
    // Список пунктов меню
    const menuItems = [
        { key: "custom", label: "custom" },
        { key: "current", label: "current" },
        { key: "default", label: "default" }
    ];
    // Кэш для данных редактора
    const editorDataCache = {};
    // Формируем HTML для бокового меню в стиле online.ts
    const sidebarHtml = `
        <div class="list-group" id="editor-sidebar">
            ${menuItems.map((item, idx) => `
                <a href="#" class="list-group-item list-group-item-action${idx === 0 ? ' active' : ''}" data-type="${item.key}">${item.label}</a>
            `).join('')}
        </div>
    `;
    // Добавляем кастомный стиль для активного пункта (как в online.ts)
    const styleId = 'editor-sidebar-active-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            #editor-sidebar .list-group-item.active {
                background: linear-gradient(90deg, #0d6efd 60%, #3a8bfd 100%);
                color: #fff;
                font-weight: bold;
                border-color: #0d6efd;
                box-shadow: 0 2px 8px rgba(13,110,253,0.10);
            }
            #editor-sidebar .list-group-item.active:focus, 
            #editor-sidebar .list-group-item.active:hover {
                background: linear-gradient(90deg, #0b5ed7 60%, #2563eb 100%);
                color: #fff;
            }
        `;
        document.head.appendChild(style);
    }
    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="mb-0">Редактор</h1>
            <button id="editor-save-btn" class="btn btn-primary">Сохранить</button>
        </div>
        <div class="row">
            <div class="col-12 col-md-2 mb-2 mb-md-0">
                ${sidebarHtml}
            </div>
            <div class="col-12 col-md-10" style="min-height:400px;">
                <div id="editor-codemirror" style="
                    border:1px solid #ced4da;
                    border-radius:0.375rem;
                    width:100%;
                    min-height:400px;
                    height:calc(100vh - 160px);
                    box-sizing:border-box;
                "></div>
            </div>
        </div>
    `;
    let editor = null;
    function loadEditorData(type) {
        // Если данные уже есть в кэше, используем их
        if (type === 'default')
            editorDataCache[type] = rootDefaultItems;
        if (editorDataCache[type]) {
            const jsonText = JSON.stringify(editorDataCache[type], null, 2);
            if (editor) {
                editor.setValue(jsonText);
            }
            else {
                // @ts-ignore
                editor = CodeMirror(document.getElementById('editor-codemirror'), {
                    value: jsonText,
                    mode: { name: "javascript", json: true },
                    lineNumbers: true,
                    lineWrapping: true,
                    theme: "default",
                    viewportMargin: Infinity,
                });
                const wrapper = editor.getWrapperElement();
                wrapper.style.height = "100%";
                wrapper.style.minHeight = "400px";
            }
            return;
        }
        // Если нет в кэше — делаем fetch
        fetch(`/admin/init/${type}`)
            .then(response => {
            if (!response.ok)
                throw new Error('Ошибка загрузки данных');
            return response.json();
        })
            .then(data => {
            editorDataCache[type] = data; // сохраняем в кэш
            const jsonText = JSON.stringify(data, null, 2);
            if (editor) {
                editor.setValue(jsonText);
            }
            else {
                // @ts-ignore
                editor = CodeMirror(document.getElementById('editor-codemirror'), {
                    value: jsonText,
                    mode: { name: "javascript", json: true },
                    lineNumbers: true,
                    lineWrapping: true,
                    theme: "default",
                    viewportMargin: Infinity,
                });
                const wrapper = editor.getWrapperElement();
                wrapper.style.height = "100%";
                wrapper.style.minHeight = "400px";
            }
        })
            .catch(error => {
            const errorText = `Ошибка: ${error.message}`;
            if (editor) {
                editor.setValue(errorText);
            }
            else {
                // @ts-ignore
                editor = CodeMirror(document.getElementById('editor-codemirror'), {
                    value: errorText,
                    mode: { name: "javascript", json: true },
                    lineNumbers: true,
                    lineWrapping: true,
                    theme: "default",
                    viewportMargin: Infinity,
                });
                const wrapper = editor.getWrapperElement();
                wrapper.style.height = "100%";
                wrapper.style.minHeight = "400px";
            }
        });
    }
    // Инициализация редактора с "custom"
    loadEditorData('custom');
    // Обработчик кликов по боковому меню
    setTimeout(() => {
        const sidebar = document.getElementById('editor-sidebar');
        const saveBtn = document.getElementById('editor-save-btn');
        let currentType = "custom";
        if (sidebar) {
            sidebar.querySelectorAll('a[data-type]').forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    // Снимаем активный класс со всех
                    sidebar.querySelectorAll('.list-group-item').forEach(item => item.classList.remove('active'));
                    // Добавляем активный класс текущему
                    e.currentTarget.classList.add('active');
                    const type = e.currentTarget.getAttribute('data-type');
                    if (type) {
                        currentType = type;
                        loadEditorData(type);
                        // Показываем кнопку только для custom
                        if (saveBtn) {
                            saveBtn.style.display = (type === "custom") ? "" : "none";
                        }
                    }
                });
            });
        }
        // Скрыть кнопку если выбран не custom при инициализации
        if (saveBtn) {
            saveBtn.style.display = (currentType === "custom") ? "" : "none";
            saveBtn.onclick = () => {
                if (!editor)
                    return;
                let json;
                try {
                    json = JSON.stringify(JSON.parse(editor.getValue()), null, 2);
                }
                catch (e) {
                    alert(e);
                    return;
                }
                const formData = new FormData();
                formData.append('json', json);
                fetch('/admin/init/save', {
                    method: 'POST',
                    body: formData
                })
                    .then(async (response) => {
                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.success === true) {
                            // Обновляем кэш для custom
                            try {
                                editorDataCache["custom"] = JSON.parse(json);
                            }
                            catch (_a) { }
                            showToast('Данные успешно сохранены');
                        }
                        else if (data && data.ex) {
                            alert(data.ex);
                        }
                        else {
                            alert('Ошибка: сервер не подтвердил сохранение');
                        }
                    }
                    else {
                        alert('Ошибка при сохранении данных');
                    }
                })
                    .catch(() => {
                    alert('Ошибка при отправке запроса');
                });
            };
        }
    }, 0);
}
