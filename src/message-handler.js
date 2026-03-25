// src/message-handler.js
// 부모 페이지(메인 플랫폼)와 postMessage 통신을 처리한다.
(function() {
    // 허용된 부모 도메인 (보안)
    // 프로덕션 배포 시 실제 도메인으로 변경할 것
    var ALLOWED_ORIGINS = [
        'https://우리도메인.com',
        'https://www.우리도메인.com',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:8080'
    ];

    function isAllowedOrigin(origin) {
        // 개발 중에는 모든 origin 허용 (프로덕션에서는 제거)
        if (location.hostname === 'localhost') return true;
        return ALLOWED_ORIGINS.indexOf(origin) !== -1;
    }

    window.addEventListener('message', function(event) {
        if (!isAllowedOrigin(event.origin)) {
            console.warn('[Entry WS] 허용되지 않은 origin:', event.origin);
            return;
        }

        var message = event.data;
        if (!message || !message.type) return;

        console.log('[Entry WS] 메시지 수신:', message.type);

        switch (message.type) {

            case 'LOAD_PROJECT':
                try {
                    Entry.loadProject(message.data.projectJson);
                    window.parent.postMessage({ type: 'PROJECT_LOADED' }, event.origin);
                } catch (error) {
                    window.parent.postMessage({
                        type: 'ERROR',
                        data: { message: '프로젝트 로드 실패: ' + error.message }
                    }, event.origin);
                }
                break;

            case 'SAVE_REQUEST':
                try {
                    var projectJson = Entry.exportProject();
                    window.parent.postMessage({
                        type: 'SAVE_RESPONSE',
                        data: { projectJson: projectJson }
                    }, event.origin);
                } catch (error) {
                    window.parent.postMessage({
                        type: 'ERROR',
                        data: { message: '프로젝트 추출 실패: ' + error.message }
                    }, event.origin);
                }
                break;

            case 'RESET_PROJECT':
                try {
                    if (message.data && message.data.projectJson) {
                        Entry.loadProject(message.data.projectJson);
                    } else {
                        Entry.loadProject(Entry.getStartProject());
                    }
                    window.parent.postMessage({ type: 'PROJECT_LOADED' }, event.origin);
                } catch (error) {
                    window.parent.postMessage({
                        type: 'ERROR',
                        data: { message: '프로젝트 리셋 실패: ' + error.message }
                    }, event.origin);
                }
                break;

            default:
                console.warn('[Entry WS] 알 수 없는 메시지 타입:', message.type);
        }
    });

    console.log('[Entry WS] postMessage 핸들러 등록 완료');
})();
