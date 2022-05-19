import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<any>();

    constructor() {
    }

    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    getAlert(): Observable<any> {
        return this.subject.asObservable();
    }

    async success(message: string, keepTimeMs: number | null = 5000) {
        this.subject.next({ type: 'success', text: message });
        if(keepTimeMs != null){
            await this.sleep(keepTimeMs);
            this.clear();
        } 
    }

    async error(message: string, keepTimeMs: number | null = 5000) {
        this.subject.next({ type: 'error', text: message });
        if(keepTimeMs != null){
            await this.sleep(keepTimeMs);
            this.clear();
        } 
    }

    clear() {
        this.subject.next(null);
    }
}