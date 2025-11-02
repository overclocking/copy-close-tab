document.addEventListener('DOMContentLoaded', () => {
    const domainInput = document.getElementById('domainInput');
    const searchButton = document.getElementById('searchButton');
    const tabList = document.getElementById('tabList');
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

    function updateCloseSelectedButton() {
        const selectedCount = document.querySelectorAll('#tabList input[type="checkbox"]:checked').length;
        closeSelectedButton.disabled = selectedCount === 0;
    }

    tabList.addEventListener('change', (e) => {
        if (e.target instanceof HTMLInputElement) {
            updateCloseSelectedButton();
        }
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