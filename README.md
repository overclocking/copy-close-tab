# Tab Manager Extension

## 버전 1.0

### 기능
- 도메인 기반 탭 검색
- 선택한 탭 닫기
- 검색된 모든 탭 닫기

### 주요 파일
- `manifest.json`: 확장 프로그램 설정
- `src/popup/`: 팝업 UI 관련 파일들
  - `popup.html`: 메인 UI 구조
  - `popup.js`: 탭 검색 및 관리 기능
  - `popup.css`: UI 스타일
- `src/background.js`: 백그라운드 스크립트
- `src/content_scripts/contentScript.js`: 콘텐츠 스크립트

### 권한
- `activeTab`: 현재 탭 접근
- `tabs`: 탭 관리

### 지원 브라우저
- Chrome
- Edge

### 릴리즈 노트
#### 버전 1.0 (2025-11-02)
- 첫 릴리즈
- 도메인 기반 탭 검색 기능 구현
- 탭 선택적 닫기 기능 구현
- 한글 인코딩 문제 해결

## Project Structure

```
hello-chrome-extension
├── src
│   ├── background.ts          # Background script for the extension
│   ├── content_scripts
│   │   └── contentScript.ts   # Content script that interacts with web pages
│   ├── popup
│   │   ├── popup.html         # HTML structure for the popup
│   │   ├── popup.ts           # TypeScript code for the popup
│   │   └── popup.css          # Styles for the popup
│   └── options
│       ├── options.html       # HTML structure for the options page
│       ├── options.ts         # TypeScript code for the options page
│       └── options.css        # Styles for the options page
├── manifest.json              # Configuration file for the Chrome extension
├── package.json               # Configuration file for npm
├── tsconfig.json              # Configuration file for TypeScript
└── README.md                  # Documentation for the project
```

## Installation

1. Clone the repository or download the project files.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click on "Load unpacked" and select the `hello-chrome-extension` directory.

## Usage

Once the extension is loaded, click on the extension icon in the Chrome toolbar to open the popup. You can also access the options page to configure any settings.

## License

This project is licensed under the MIT License.
=======
# copy-close-tab
Copy and Close Tab for EDGE, Chorme
>>>>>>> 317dca69ea8812e4eeabd81c866ec08ccc8ebc07
