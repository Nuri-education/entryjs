// src/workspace-ready.js
// Entry 초기화 완료 후 부모 페이지에 준비 완료를 알린다.
(function() {
    var notified = false;

    function notifyReady() {
        if (notified) return;
        notified = true;
        window.parent.postMessage({ type: 'WORKSPACE_READY' }, '*');
        console.log('[Entry WS] WORKSPACE_READY 전송');
        // 자동 저장 시작
        if (window._startEntryAutoSave) {
            window._startEntryAutoSave();
        }
    }

    // example.ejs의 Entry.init() 완료 후 명시적으로 호출하는 경로 (권장)
    window._notifyWorkspaceReady = notifyReady;

    // 폴백: 명시적 호출이 없을 경우 Entry 워크스페이스 DOM 생성 완료를 감지
    // (Entry.container가 초기화되면 실제 렌더링이 완료된 것으로 판단)
    var readyCheckInterval = setInterval(function() {
        if (
            typeof Entry !== 'undefined' &&
            Entry.loadProject &&
            Entry.exportProject &&
            Entry.container &&
            Entry.container.objects_
        ) {
            clearInterval(readyCheckInterval);
            notifyReady();
        }
    }, 200);

    // 15초 후에도 준비 안 되면 타임아웃
    setTimeout(function() {
        clearInterval(readyCheckInterval);
    }, 15000);
})();
