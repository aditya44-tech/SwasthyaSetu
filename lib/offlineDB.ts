const DB_NAME = 'SwasthyaSetuOffline';
const DB_VERSION = 1;

export interface PendingAction {
    id: string;
    type: 'register_patient' | 'analyze_symptoms' | 'escalate_case';
    data: any;
    createdAt: string;
}

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
            return reject(new Error('IndexedDB not available'));
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains('pendingActions')) {
                db.createObjectStore('pendingActions', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('cachedPatients')) {
                db.createObjectStore('cachedPatients', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('cachedCases')) {
                db.createObjectStore('cachedCases', { keyPath: 'id' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// ── Save a pending action for later sync ──
export async function savePendingAction(action: PendingAction): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('pendingActions', 'readwrite');
        tx.objectStore('pendingActions').put(action);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

export async function getPendingActions(): Promise<PendingAction[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('pendingActions', 'readonly');
        const req = tx.objectStore('pendingActions').getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export async function removePendingAction(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('pendingActions', 'readwrite');
        tx.objectStore('pendingActions').delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// ── Cache patients locally ──
export async function cachePatients(patients: any[]): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('cachedPatients', 'readwrite');
        const store = tx.objectStore('cachedPatients');
        patients.forEach(p => store.put({ ...p, id: p._id || p.id }));
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

export async function getCachedPatients(): Promise<any[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('cachedPatients', 'readonly');
        const req = tx.objectStore('cachedPatients').getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export async function removeCachedPatient(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('cachedPatients', 'readwrite');
        tx.objectStore('cachedPatients').delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// ── Cache cases locally ──
export async function cacheCases(cases: any[]): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('cachedCases', 'readwrite');
        const store = tx.objectStore('cachedCases');
        cases.forEach(c => store.put({ ...c, id: c._id || c.id }));
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

export async function getCachedCases(): Promise<any[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('cachedCases', 'readonly');
        const req = tx.objectStore('cachedCases').getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

// ── Sync all pending actions to the server ──
export async function syncPendingActions(): Promise<{ synced: number; failed: number }> {
    const actions = await getPendingActions();
    let synced = 0;
    let failed = 0;

    for (const action of actions) {
        try {
            let url = '';
            if (action.type === 'register_patient') url = '/api/patients';
            else if (action.type === 'analyze_symptoms') url = '/api/analyze';
            else if (action.type === 'escalate_case') url = '/api/escalate';

            if (!url) continue;

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(action.data),
            });

            if (res.ok) {
                await removePendingAction(action.id);
                synced++;
            } else {
                failed++;
            }
        } catch {
            failed++;
        }
    }

    return { synced, failed };
}

export async function getPendingCount(): Promise<number> {
    const actions = await getPendingActions();
    return actions.length;
}
