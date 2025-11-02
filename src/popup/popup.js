function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

document.addEventListener('DOMContentLoaded', () => {
    const domainInput = document.getElementById('domainInput');
    const searchButton = document.getElementById('searchButton');
    const tabList = document.getElementById('tabList');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const selectedCount = document.getElementById('selectedCount');
    const copyAndCloseButton = document.getElementById('copyAndCloseTabs');
    const closeSelectedButton = document.getElementById('closeSelectedTabs');
    const closeAllButton = document.getElementById('closeAllTabs');

    let matchingTabs = [];

    searchButton.addEventListener('click', async () => {
        const domain = domainInput.value.trim().toLowerCase();
        if (!domain) {
            alert('도메인을 입력해주세요.');
            return;
        }

        // 모든 탭 검색
        const tabs = await chrome.tabs.query({});
        matchingTabs = tabs
            .filter(tab => tab.url && tab.url.toLowerCase().includes(domain))
            .map(tab => ({
                id: tab.id,
                url: tab.url,
                title: tab.title || '제목 없음'
            }));

        // 결과 표시
        renderTabs();
    });

    function renderTabs() {
        tabList.innerHTML = '';
        if (matchingTabs.length === 0) {
            tabList.innerHTML = '<li>일치하는 탭이 없습니다.</li>';
            closeAllButton.disabled = true;
            closeSelectedButton.disabled = true;
            return;
        }

        matchingTabs.forEach(tab => {
            const li = document.createElement('li');
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.tabId = tab.id.toString();
            
            const text = document.createElement('span');
            text.textContent = `${tab.title} - ${tab.url}`;
            
            li.appendChild(checkbox);
            li.appendChild(text);
            tabList.appendChild(li);
        });

        closeAllButton.disabled = false;
        updateCloseSelectedButton();
    }

    function updateButtonsAndCount() {
        const checkedBoxes = document.querySelectorAll('#tabList input[type="checkbox"]:checked');
        const checkedCount = checkedBoxes.length;
        const totalCount = matchingTabs.length;
        
        selectedCount.textContent = totalCount > 0 ? `(${checkedCount}/${totalCount})` : '';
        closeSelectedButton.disabled = checkedCount === 0;
        copyAndCloseButton.disabled = checkedCount === 0;
        selectAllCheckbox.checked = checkedCount === totalCount && totalCount > 0;
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('클립보드 복사 실패:', err);
        });
    }

    tabList.addEventListener('change', (e) => {
        if (e.target instanceof HTMLInputElement) {
            updateButtonsAndCount();
        }
    });

    selectAllCheckbox.addEventListener('change', () => {
        const checkboxes = document.querySelectorAll('#tabList input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
        updateButtonsAndCount();
    });

    copyAndCloseButton.addEventListener('click', async () => {
        const selectedTabs = Array.from(document.querySelectorAll('#tabList input[type="checkbox"]:checked'))
            .map(cb => matchingTabs.find(tab => tab.id === parseInt(cb.dataset.tabId)))
            .filter(tab => tab != null);

        const urls = selectedTabs.map(tab => tab.url).join('\r\n');
        copyToClipboard(urls);

        const tabIds = selectedTabs.map(tab => tab.id);
        await chrome.tabs.remove(tabIds);
        matchingTabs = matchingTabs.filter(tab => !tabIds.includes(tab.id));
        renderTabs();
    });

    closeSelectedButton.addEventListener('click', async () => {
        const selectedTabIds = Array.from(document.querySelectorAll('#tabList input[type="checkbox"]:checked'))
            .map(cb => parseInt(cb.dataset.tabId));
        
        await chrome.tabs.remove(selectedTabIds);
        matchingTabs = matchingTabs.filter(tab => !selectedTabIds.includes(tab.id));
        renderTabs();
    });

    closeAllButton.addEventListener('click', async () => {
        const tabIds = matchingTabs.map(tab => tab.id);
        await chrome.tabs.remove(tabIds);
        matchingTabs = [];
        renderTabs();
    });
});