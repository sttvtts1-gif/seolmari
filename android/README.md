# 태양광 발전용량 계산기 - 안드로이드 WebView 앱

`../index.html`에 있는 웹앱을 그대로 감싸는 최소 구성 WebView 안드로이드 프로젝트입니다.
카카오맵 기능 자체는 전부 웹앱(JavaScript SDK) 쪽에서 동작하며, 이 안드로이드 프로젝트는
그 웹앱을 전체 화면으로 띄워주는 껍데기 역할만 합니다.

## 빌드하기 전에 반드시 해야 할 일

1. **웹앱을 실제 https 주소에 호스팅하세요.**
   카카오맵 JavaScript SDK는 카카오 개발자 콘솔에 등록된 도메인에서만 동작합니다.
   `file://`로 로컬 파일을 직접 여는 방식은 동작하지 않습니다.
   (예: GitHub Pages로 이 저장소를 배포하면 `https://<사용자명>.github.io/<저장소명>/` 형태의 주소가 생깁니다.)

2. **`app/src/main/java/com/seolmari/solarcalc/MainActivity.kt`의 `siteUrl` 값을
   실제 호스팅 주소로 수정하세요.** 현재는 추정 주소가 자리표시자로 들어가 있어
   실제로 배포되기 전까지는 정확한 값이 아닙니다.

3. **카카오 개발자 콘솔(developers.kakao.com) > 내 애플리케이션 > 플랫폼 > Web**에서
   같은 https 도메인을 "사이트 도메인"으로 등록하세요.

## 빌드 방법

이 컨테이너 환경에는 Android SDK가 없고, Google Maven 저장소(dl.google.com) 접근도
방화벽에 막혀 있어 여기서는 Gradle 빌드를 실행/검증할 수 없었습니다. Gradle 래퍼
스크립트(`gradlew`, `gradlew.bat`)만 미리 생성해 두었습니다.

1. Android Studio(최신 버전)로 이 `android/` 폴더를 엽니다.
2. Android SDK, JDK는 Android Studio가 자동으로 준비합니다. Gradle Sync가 끝날 때까지 기다립니다.
3. 상단 실행(▶) 버튼으로 에뮬레이터 또는 실제 기기에서 실행하거나,
   Build > Generate Signed Bundle / APK 로 APK/AAB를 만듭니다.

## 구성

- `MainActivity.kt`: WebView 생성, 자바스크립트/로컬스토리지/핀치줌 활성화, 뒤로가기 처리
- `AndroidManifest.xml`: 인터넷 권한만 사용 (위치 등 다른 권한 없음)
- `minSdk 26` (Android 8.0 이상) — 이 이하 버전은 지원하지 않습니다.
