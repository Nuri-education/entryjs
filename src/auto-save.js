// src/auto-save.js
// 주기적으로 프로젝트 JSON을 부모 페이지에 전달한다.
(function() {
    var AUTO_SAVE_INTERVAL = 30000; // 30초
    var autoSaveTimer = null;

    function startAutoSave() {
        if (autoSaveTimer) clearInterval(autoSaveTimer);
        autoSaveTimer = setInterval(function() {
            try {
                if (typeof Entry !== 'undefined' && Entry.exportProject) {
                    var projectJson = Entry.exportProject();
                    window.parent.postMessage({
                        type: 'AUTO_SAVE',
                        data: { projectJson: projectJson }
                    }, '*');
                }
            } catch (error) {
                console.error('[Entry WS] 자동 저장 실패:', error);
            }
        }, AUTO_SAVE_INTERVAL);

        console.log('[Entry WS] 자동 저장 시작 (' + (AUTO_SAVE_INTERVAL / 1000) + '초 간격)');
    }

    // Entry 초기화 완료 후 자동 저장 시작
    // entryjs의 초기화 타이밍에 맞춰 호출해야 함
    window._startEntryAutoSave = startAutoSave;
})();
