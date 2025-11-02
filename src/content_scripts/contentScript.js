// 웹 페이지의 모든 링크를 찾아서 처리
function processLinks() {
    // 페이지의 모든 링크 선택
    const links = document.getElementsByTagName('a');
    
    // 각 링크에 대해 처리
    for (let link of links) {
        // 링크가 우리가 찾는 도메인을 포함하는지 확인
        if (link.href && !link.classList.contains('extension-processed')) {
            // 이미 처리된 링크는 건너뛰기 위한 클래스 추가
            link.classList.add('extension-processed');
            
            // 아이콘 요소 생성
            const icon = document.createElement('span');
            icon.textContent = ' 🔍'; // 간단한 아이콘 이모지
            icon.style.cursor = 'pointer';
            
            // 아이콘 클릭 이벤트
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // 확장 프로그램에 메시지 전송
                chrome.runtime.sendMessage({
                    action: 'addToSearch',
                    url: link.href
                });
            });
            
            // 링크에 아이콘 추가
            link.appendChild(icon);
        }
    }
}

// 페이지 로드 시 실행
processLinks();

// DOM 변경 감지하여 새로 추가되는 링크도 처리
const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.addedNodes.length) {
            processLinks();
        }
    }
});

// DOM 변경 감지 시작
observer.observe(document.body, {
    childList: true,
    subtree: true
});