import { showUser } from '@placeos/ts-client';
import { BehaviorSubject, combineLatest, lastValueFrom, timer } from 'rxjs';
import { map, retry } from 'rxjs/operators';

import { StaffUser } from 'libs/users/src/lib/user.class';
import { replaceUser } from 'libs/users/src/lib/user.pipe';

const EMPTY_USER = {
    name: '<empty>',
    email: '<empty>@place.tech',
} as StaffUser;

const _current_user = new BehaviorSubject<StaffUser>(null);
const _change = new BehaviorSubject(0);

export const current_user = _current_user.asObservable();

declare let jest;

setTimeout(() => {
    try {
        if (jest) return;
    } catch {}
    combineLatest([showUser('current'), _change])
        .pipe(
            retry({
                count: 10,
                delay: (error, count) => {
                    const delay_ms = Math.min(1000 * Math.pow(2, count), 30000);
                    console.warn(
                        `User loading failed, retrying in ${delay_ms}ms (attempt ${count}/10)`,
                        error,
                    );
                    return timer(delay_ms);
                },
            }),
            map(([i]) => new StaffUser(i as any)),
        )
        .subscribe((user) => _current_user.next(user));
}, 300);

export function reloadUserData() {
    setTimeout(async () => {
        const p_user = await lastValueFrom(showUser('current'));
        const user = new StaffUser(p_user as any);
        replaceUser(user);
        _current_user.next(user);
    }, 300);
}

/** Get the current user details */
export function currentUser() {
    return _current_user.getValue() || EMPTY_USER;
}
